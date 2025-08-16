import { useState } from 'react';
import ExamStatusCard from '../../components/Exam/ExamStatusCard';

const TeacherExamView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Sample exam data for teachers (same as Student for now)
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
    }
    // ...other sample exams
  ]);

  // Filtering
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

  const handleAddExam = () => {
    console.log("Open modal or form to create new exam");
    // later: open modal to create exam
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container py-4 px-4">
      <h1 className="h3 fw-bold m-0 mb-2">Manage Exams</h1>

      {/* Search & View Mode */}
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search exams..."
          style={{ maxWidth: '250px' }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
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
        {/* Fixed "Add Exam" card at first spot */}
        <div
          onClick={handleAddExam}
          style={{
            flex: viewMode === 'grid' ? '1 1 calc(33.333% - 1rem)' : '1 1 100%',
            maxWidth: viewMode === 'grid' ? '15rem' : '100%',
            minHeight: '8rem',
            border: '2px dashed #aaa',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555',
            cursor: 'pointer',
            background: '#f9f9f9'
          }}
        >
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>+</div>
            <div>Add New Exam</div>
          </div>
        </div>

        {/* Existing exams */}
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

export default TeacherExamView;
