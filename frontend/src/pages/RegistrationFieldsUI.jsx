import React from "react";

export default function RegistrationFieldsUI({ formData, errors, handleChange }) {
  return (
    <>
      <div className="mb-3 d-flex flex-column align-items-start">
        <label htmlFor="email" className="form-label text-secondary small">
          Email
        </label>
        <input
          type="email"
          className={`form-control input-focus ${errors.email ? "is-invalid" : ""}`}
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3 d-flex flex-column align-items-start">
        <label htmlFor="username" className="form-label text-secondary small">
          Username
        </label>
        <input
          type="text"
          className={`form-control input-focus ${errors.username ? "is-invalid" : ""}`}
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username}</div>
        )}
      </div>

      <div className="mb-3 d-flex flex-column align-items-start">
        <label htmlFor="role" className="form-label text-secondary small">
          Role
        </label>
        <select
          id="role"
          name="role"
          className={`form-select ${errors.role ? "is-invalid" : ""}`}
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">-- Select Role --</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
        {errors.role && <div className="invalid-feedback">{errors.role}</div>}
      </div>

      <div className="mb-3 d-flex flex-column align-items-start">
        <label htmlFor="password" className="form-label text-secondary small">
          Password
        </label>
        <input
          type="password"
          className={`form-control input-focus ${errors.password ? "is-invalid" : ""}`}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      <div className="mb-3 d-flex flex-column align-items-start">
        <label
          htmlFor="confirmPassword"
          className="form-label text-secondary small"
        >
          Confirm Password
        </label>
        <input
          type="password"
          className={`form-control input-focus ${
            errors.confirmPassword ? "is-invalid" : ""
          }`}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>
    </>
  );
}
