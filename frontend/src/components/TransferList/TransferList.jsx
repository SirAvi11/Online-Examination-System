import { useState } from "react";
import "./TransferList.css";

const TransferList = ({
  availableItems,
  selectedItems,
  setAvailableItems,
  setSelectedItems,
  renderItem,
  leftTitle = "Available",
  rightTitle = "Selected",
  getItemKey = (item) => item.id,
  getItemLabel = (item) => item.label,
  showMarks = false,
  getItemMarks = (item) => item.marks || 0,
}) => {
  const [checkedLeft, setCheckedLeft] = useState([]);
  const [checkedRight, setCheckedRight] = useState([]);

  // Move from left → right
  const moveToRight = () => {
    setSelectedItems([...selectedItems, ...checkedLeft]);
    setAvailableItems(availableItems.filter((q) => !checkedLeft.includes(q)));
    setCheckedLeft([]);
  };

  // Move from right → left
  const moveToLeft = () => {
    setAvailableItems([...availableItems, ...checkedRight]);
    setSelectedItems(selectedItems.filter((q) => !checkedRight.includes(q)));
    setCheckedRight([]);
  };

  return (
    <div className="transfer-container">
      {/* Left List */}
      <div className="list">
        <div className="questions-fixed">
          <h4 className="listbox-title">
            {leftTitle} ({availableItems.length})
          </h4>
          <div className="list-header">
            <label className="question select-all">
              <input
                type="checkbox"
                checked={
                  availableItems.length > 0 &&
                  checkedLeft.length === availableItems.length
                }
                onChange={(e) =>
                  e.target.checked
                    ? setCheckedLeft(availableItems)
                    : setCheckedLeft([])
                }
              />
              Select All ({checkedLeft.length})
            </label>
            {showMarks && <span className="marks-label">Marks</span>}
          </div>
        </div>
        <div className="questions-scroll">
          {availableItems.map((item) => (
            <div key={getItemKey(item)} className="question-row">
              <label className="question">
                <input
                  type="checkbox"
                  checked={checkedLeft.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedLeft([...checkedLeft, item]);
                    } else {
                      setCheckedLeft(
                        checkedLeft.filter((i) => i !== item)
                      );
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
            {rightTitle} ({selectedItems.length})
          </h4>
          <div className="list-header">
            <label className="question select-all">
              <input
                type="checkbox"
                checked={
                  selectedItems.length > 0 &&
                  checkedRight.length === selectedItems.length
                }
                onChange={(e) =>
                  e.target.checked
                    ? setCheckedRight(selectedItems)
                    : setCheckedRight([])
                }
              />
              Select All ({checkedRight.length})
            </label>
            {showMarks && (
              <span className="marks-label">
                Marks (
                {selectedItems.reduce(
                  (sum, q) => sum + getItemMarks(q),
                  0
                )}
                )
              </span>
            )}
          </div>
        </div>
        <div className="questions-scroll">
          {selectedItems.map((item) => (
            <div key={getItemKey(item)} className="question-row">
              <label className="question">
                <input
                  type="checkbox"
                  checked={checkedRight.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedRight([...checkedRight, item]);
                    } else {
                      setCheckedRight(
                        checkedRight.filter((i) => i !== item)
                      );
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
