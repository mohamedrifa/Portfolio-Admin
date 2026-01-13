import React from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";

const EducationPanel = ({
  education,
  addEducation,
  removeEducation,
  updateEducation,
}) => {
  return (
    <Panel title="Education">
      <TableLike
        headers={[
          "Course / Stream",
          "Institution",
          "From",
          "To",
          "Percentage / CGPA",
        ]}
        rows={education}
        renderRow={(e) => (
          <>
            <div style={{ flex: 1 }}>
              <InputField
                id={`edu-stream-${e.id}`}
                value={e.stream}
                onChange={(ev) =>
                  updateEducation(e.id, "stream", ev.target.value)
                }
                placeholder="Course / Stream"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`edu-institute-${e.id}`}
                value={e.institute}
                onChange={(ev) =>
                  updateEducation(e.id, "institute", ev.target.value)
                }
                placeholder="Institution"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`edu-from-${e.id}`}
                value={e.from}
                onChange={(ev) =>
                  updateEducation(e.id, "from", ev.target.value)
                }
                placeholder="From"
                type="month"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`edu-to-${e.id}`}
                value={e.to}
                onChange={(ev) =>
                  updateEducation(e.id, "to", ev.target.value)
                }
                placeholder="To"
                type="month"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`edu-perc-${e.id}`}
                value={e.percentage}
                onChange={(ev) =>
                  updateEducation(e.id, "percentage", ev.target.value)
                }
                placeholder="Percentage / CGPA"
                type="text"
              />
            </div>
          </>
        )}
        onAdd={addEducation}
        onRemove={removeEducation}
      />
    </Panel>
  );
};

export default EducationPanel;
