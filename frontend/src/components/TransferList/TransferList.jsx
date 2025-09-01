import { useState, useEffect } from "react";
import "./TransferList.css";

const TransferList = ({
  availableItems,
  selectedItems,
  setAvailableItems,
  setSelectedItems,
  activeModuleId,
  renderItem,
  leftTitle = "Available",
  rightTitle = "Selected",
  getItemKey = (item) => item._id, // unique id for item
  getItemLabel = (item) => item.questionText,
  showMarks = true,
  getItemMarks = (item) => item.marks || 0,
}) => {
  const [checkedLeft, setCheckedLeft] = useState([]);
  const [checkedRight, setCheckedRight] = useState([]);

  // 🔹 Reset checkboxes when availableItems updates OR module changes
  useEffect(() => {
    setCheckedLeft([]);
    setCheckedRight([]);
  }, [availableItems, activeModuleId]);

   // Get IDs of already selected questions
  const selectedIds = new Set(selectedItems.map((q) => q._id));

  // 🔹 Only items from active module should be visible in both lists
  const filteredAvailable = availableItems.filter(
    (q) => q.moduleId === activeModuleId && !selectedIds.has(q._id)
  );
  
  const filteredSelected = selectedItems;


  // Move from left → right
  const moveToRight = () => {
    const newItems = checkedLeft.filter(
      (item) => !filteredSelected.some((s) => s._id === item._id)
    );

    setSelectedItems([...selectedItems, ...newItems]);
    setAvailableItems(
      availableItems.filter((q) => !checkedLeft.some((sel) => sel._id === q._id))
    );
    setCheckedLeft([]);
  };

  // Move from right → left
  const moveToLeft = () => {
    const remainingSelected = selectedItems.filter(
      (q) => !checkedRight.some((sel) => sel._id === q._id)
    );

    const movedItems = checkedRight.filter(
      (sel) => sel.moduleId === activeModuleId
    );

    // Add items back to available
    setAvailableItems([...availableItems, ...movedItems]);

    // Update selectedItems without moved ones
    setSelectedItems(remainingSelected);
    setCheckedRight([]);
  };

  return (
    <div className="transfer-container">
      {/* Left List */}
      <div className="list">
        <div className="questions-fixed">
          <h4 className="listbox-title">
            {leftTitle} ({filteredAvailable.length})
          </h4>
          <div className="list-header">
            <label className="question select-all">
              <input
                type="checkbox"
                checked={
                  filteredAvailable.length > 0 &&
                  checkedLeft.length === filteredAvailable.length
                }
                onChange={(e) =>
                  e.target.checked
                    ? setCheckedLeft(filteredAvailable)
                    : setCheckedLeft([])
                }
              />
              Select All ({checkedLeft.length})
            </label>
            {showMarks && <span className="marks-label">Marks</span>}
          </div>
        </div>
        <div className="questions-scroll">
          {filteredAvailable.map((item) => (
            <div key={getItemKey(item)} className="question-row">
              <label className="question">
                <input
                  type="checkbox"
                  checked={checkedLeft.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedLeft([...checkedLeft, item]);
                    } else {
                      setCheckedLeft(checkedLeft.filter((i) => i !== item));
                    }
                  }}
                />
                {renderItem ? renderItem(item) : getItemLabel(item)}
              </label>
              {showMarks && (
                <span className="question-marks">{getItemMarks(item)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons">
        <button onClick={moveToRight} disabled={checkedLeft.length === 0}>
          →
        </button>
        <button onClick={moveToLeft} disabled={checkedRight.length === 0}>
          ←
        </button>
      </div>

      {/* Right List */}
      <div className="list">
        <div className="questions-fixed">
          <h4 className="listbox-title">
            {rightTitle} ({filteredSelected.length})
          </h4>
          <div className="list-header">
            <label className="question select-all">
              <input
                type="checkbox"
                checked={
                  filteredSelected.length > 0 &&
                  checkedRight.length === filteredSelected.length
                }
                onChange={(e) =>
                  e.target.checked
                    ? setCheckedRight(filteredSelected)
                    : setCheckedRight([])
                }
              />
              Select All ({checkedRight.length})
            </label>
            {showMarks && (
              <span className="marks-label">
                Marks (
                {filteredSelected.reduce((sum, q) => sum + getItemMarks(q), 0)})
              </span>
            )}
          </div>
        </div>
        <div className="questions-scroll">
          {filteredSelected.map((item) => (
            <div key={getItemKey(item)} className="question-row">
              <label className="question">
                <input
                  type="checkbox"
                  checked={checkedRight.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedRight([...checkedRight, item]);
                    } else {
                      setCheckedRight(checkedRight.filter((i) => i !== item));
                    }
                  }}
                />
                {renderItem ? renderItem(item) : getItemLabel(item)}
              </label>
              {showMarks && (
                <span className="question-marks">{getItemMarks(item)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransferList;
