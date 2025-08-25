// useQuestion.js
import { useState, useEffect } from "react";

const useQuestion = (moduleId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState({
    show: false,
    existing: null,
    attempted: null,
    questionNumber: null,
    message: null,
  });
  const [successInfo, setSuccessInfo] = useState({
    show: false,
    message: "",
    questionNumber: null,
  });

  // Fetch questions
 // Get authentication token
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Extract the fetch logic into a reusable function
  const fetchQuestionsData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(
        `http://localhost:5000/api/questions?moduleId=${moduleId}`,
        {
          headers: {
            'x-Auth-token': token
          }
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch questions');
      }
      
      const data = await res.json();
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions on mount and when moduleId changes
  useEffect(() => {
    if (moduleId) fetchQuestionsData();
  }, [moduleId]);


  // Add new question
  // useQuestion.js - Update the addQuestion function
  const addQuestion = async (newQuestionData) => {
    // Validate the question first
    if (!newQuestionData.questionText?.trim() || !newQuestionData.answer) {
      setDuplicateInfo({
        show: true,
        message: "Please provide a valid question and answer.",
      });
      return false;
    }

    // Normalize new text
    const normalizeText = (text) => {
      return text
        ?.toLowerCase()
        ?.trim()
        ?.replace(/\s+/g, " ")
        ?.replace(/[?!.]+$/, "") || "";
    };

    const newNormalized = normalizeText(newQuestionData.questionText);

    // Check duplicate
    const duplicateIndex = questions.findIndex(
      (q) => normalizeText(q.questionText) === newNormalized
    );

    if (duplicateIndex !== -1) {
      setDuplicateInfo({
        show: true,
        questionNumber: duplicateIndex + 1,
        existing: questions[duplicateIndex].questionText,
        attempted: newQuestionData.questionText,
      });
      return false;
    }

    // Check answer validity
    const correctOptionIndex = newQuestionData.options.findIndex(
      (opt) => opt === newQuestionData.answer
    );
    
    if (correctOptionIndex === -1) {
      setDuplicateInfo({
        show: true,
        message: "Correct answer must match one of the options.",
      });
      return false;
    }

    // If validation passes, save the question
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("questionText", newQuestionData.questionText);
      formData.append("moduleId", moduleId || newQuestionData.moduleId);
      formData.append("marks", newQuestionData.marks);
      formData.append("correctOptionIndex", correctOptionIndex);
      formData.append("options", JSON.stringify(newQuestionData.options));
      
      if (newQuestionData.paperId) formData.append("paperId", newQuestionData.paperId);
      if (newQuestionData.imageFile) formData.append("image", newQuestionData.imageFile);
      

      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save question');

      const savedQuestion = await res.json();
      setQuestions((prev) => [...prev, savedQuestion]);
      
      // Show success message
      setSuccessInfo({
        show: true,
        message: "Question added successfully!",
        questionNumber: questions.length + 1,
      });

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setSuccessInfo({
          show: false,
          message: "",
          questionNumber: null,
        });
      }, 3000);
      
      return true;
    } catch (err) {
      console.error("Failed to save question:", err);
      setDuplicateInfo({
        show: true,
        message: "Failed to save question. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete questions in bulk
  const deleteQuestions = async (questionIds) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/questions/bulk-delete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: questionIds }),
        }
      );

      if (res.ok) {
        setQuestions((prev) =>
          prev.filter((q) => !questionIds.includes(q._id))
        );
        return true;
      } else {
        const error = await res.json();
        throw new Error(error.message || "Error deleting questions");
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  //Toggle Archieved Questions

  const toggleArchiveQuestions = async(questionIds, archive) =>{
    try {
      const res = await fetch(
        "http://localhost:5000/api/questions/archive-toggle",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionIds, archive }),
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error toggling archive status');
      }

      // Refresh questions after archive operation
      await fetchQuestionsData();
      return true;

    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  // Reset duplicate info
  const resetDuplicateInfo = () => {
    setDuplicateInfo({
      show: false,
      existing: null,
      attempted: null,
      questionNumber: null,
      message: null,
    });
  };

  // Reset success info
  const resetSuccessInfo = () => {
    setSuccessInfo({
      show: false,
      message: "",
      questionNumber: null,
    });
  };

  return {
    questions,
    loading,
    error,
    isSaving,
    duplicateInfo,
    successInfo,
    toggleArchiveQuestions,
    setQuestions,
    addQuestion,
    deleteQuestions,
    resetDuplicateInfo,
    resetSuccessInfo,
  };
};

export default useQuestion;