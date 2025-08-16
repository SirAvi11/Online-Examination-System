import { useState } from 'react';
import ExamStatusCard from '../../components/Exam/ExamStatusCard';

const StudentExamView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Sample data
  const [exams, setExams] = useState([
  {
    id: 1,
    title: 'Midterm Exam - Mathematics',
    subtitle: 'Test Date:',
    dateRange: 'Mar 15, 2025 - Mar 17, 2025',
    status: 'In Progress',
    statusVariant: 'primary'
  },
  {
    id: 2,
    title: 'Final Exam - Computer Science',
    subtitle: 'Test Date:',
    dateRange: 'May 10, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 3,
    title: 'Quiz 1 - Physics',
    subtitle: 'Test Date:',
    dateRange: 'Feb 28, 2025',
    status: 'Completed',
    statusVariant: 'success'
  },
  {
    id: 4,
    title: 'Midterm Exam - Chemistry',
    subtitle: 'Test Date:',
    dateRange: 'Apr 5, 2025 - Apr 7, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 5,
    title: 'Unit Test - English Literature',
    subtitle: 'Test Date:',
    dateRange: 'Mar 25, 2025',
    status: 'In Progress',
    statusVariant: 'primary'
  },
  {
    id: 6,
    title: 'Lab Assessment - Biology',
    subtitle: 'Test Date:',
    dateRange: 'Apr 12, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 7,
    title: 'Final Exam - History',
    subtitle: 'Test Date:',
    dateRange: 'May 20, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 8,
    title: 'Quiz 2 - Physics',
    subtitle: 'Test Date:',
    dateRange: 'Mar 2, 2025',
    status: 'Completed',
    statusVariant: 'success'
  },
  {
    id: 9,
    title: 'Assignment Test - Economics',
    subtitle: 'Test Date:',
    dateRange: 'Apr 1, 2025',
    status: 'In Progress',
    statusVariant: 'primary'
  },
  {
    id: 10,
    title: 'Mock Test - Programming Fundamentals',
    subtitle: 'Test Date:',
    dateRange: 'Mar 18, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 11,
    title: 'Mock McQ - Programming',
    subtitle: 'Test Date:',
    dateRange: 'Mar 19, 2025',
    status: 'Upcoming',
    statusVariant: 'primary'
  },
  {
    id: 12,
    title: 'Quiz - Environmental Science',
    subtitle: 'Test Date:',
    dateRange: 'Feb 22, 2025',
    status: 'Completed',
    statusVariant: 'success'
  },
  {
    id: 13,
    title: 'Unit Test - Geography',
    subtitle: 'Test Date:',
    dateRange: 'Apr 8, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 14,
    title: 'Lab Practical - Physics',
    subtitle: 'Test Date:',
    dateRange: 'Mar 30, 2025',
    status: 'In Progress',
    statusVariant: 'primary'
  },
  {
    id: 15,
    title: 'Semester Exam - Political Science',
    subtitle: 'Test Date:',
    dateRange: 'Jun 5, 2025 - Jun 6, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 16,
    title: 'Final Project Review - Computer Applications',
    subtitle: 'Test Date:',
    dateRange: 'May 25, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 17,
    title: 'Mock Interview Assessment',
    subtitle: 'Test Date:',
    dateRange: 'Apr 18, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 18,
    title: 'Practical Assessment - Chemistry Lab',
    subtitle: 'Test Date:',
    dateRange: 'Mar 27, 2025',
    status: 'In Progress',
    statusVariant: 'primary'
  },
  {
    id: 19,
    title: 'Monthly Quiz - Mathematics',
    subtitle: 'Test Date:',
    dateRange: 'Feb 26, 2025',
    status: 'Completed',
    statusVariant: 'success'
  },
  {
    id: 20,
    title: 'Short Test - Data Structures',
    subtitle: 'Test Date:',
    dateRange: 'Apr 15, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 21,
    title: 'Final Exam - Business Management',
    subtitle: 'Test Date:',
    dateRange: 'May 28, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 22,
    title: 'Weekly Quiz - Computer Networks',
    subtitle: 'Test Date:',
    dateRange: 'Mar 12, 2025',
    status: 'In Progress',
    statusVariant: 'primary'
  },
  {
    id: 23,
    title: 'Oral Assessment - English Speaking Skills',
    subtitle: 'Test Date:',
    dateRange: 'Mar 22, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 24,
    title: 'Case Study Presentation - Marketing',
    subtitle: 'Test Date:',
    dateRange: 'Apr 20, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  },
  {
    id: 25,
    title: 'Research Paper Submission - Psychology',
    subtitle: 'Test Date:',
    dateRange: 'May 2, 2025',
    status: 'Upcoming',
    statusVariant: 'warning'
  }
]);


  // Filtered data
  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, startIndex + itemsPerPage);

  const handleCardClick = (examId) => {
    console.log(`Exam ${examId} clicked`);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container py-4 px-4">
      <h1 className="h3 fw-bold m-0 mb-2">Examinations</h1>

      {/* Search & View Mode */}
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search examinations..."
          style={{ maxWidth: '250px' }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
        />
        <div className="ms-auto d-flex gap-2">
          <button
            className={`btn btn-outline-primary ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={`btn btn-outline-primary ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      {/* Exams Layout */}
      <section
        aria-label="Examination cards"
        style={{
          display: 'flex',
          flexDirection: viewMode === 'grid' ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: '0.7rem'
        }}
      >
        {currentExams.length > 0 ? (
          currentExams.map(exam => (
            <div
              key={exam.id}
              style={{
                flex: viewMode === 'grid' ? '1 1 calc(33.333% - 1rem)' : '1 1 100%',
                maxWidth: viewMode === 'grid' ? '15rem' : '100%'
              }}
            >
              <ExamStatusCard
                title={exam.title}
                subtitle={exam.subtitle}
                dateRange={exam.dateRange}
                status={exam.status}
                statusVariant={exam.statusVariant}
                onCardClick={() => handleCardClick(exam.id)}
                maxWidth={viewMode === 'list' ? '100%' : '20rem'}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-5" style={{ width: '100%' }}>
            <p className="text-muted">No exams found matching your search</p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4" style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      backgroundColor: '#fff',
      padding: '0.75rem 0rem 1rem 0.75rem',
      zIndex: 1000,
    }}>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => goToPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default StudentExamView;
