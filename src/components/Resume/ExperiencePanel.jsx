import React from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";

const ExperiencePanel = ({
  experience,
  addExperience,
  removeExperience,
  updateExperience,
}) => {
  return (
    <Panel title="Experience" hint='Use “;” for line breaks in Summary'>
      <TableLike
        headers={["Role", "Location / Mode", "Company", "From", "To", "Summary"]}
        rows={experience}
        renderRow={(x) => (
          <>
            <div style={{ flex: 1 }}>
              <InputField
                id={`exp-role-${x.id}`}
                value={x.role}
                onChange={(e) =>
                  updateExperience(x.id, "role", e.target.value)
                }
                placeholder="Role"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`exp-location-${x.id}`}
                value={x.location}
                onChange={(e) =>
                  updateExperience(x.id, "location", e.target.value)
                }
                placeholder="Location / Remote"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`exp-company-${x.id}`}
                value={x.company}
                onChange={(e) =>
                  updateExperience(x.id, "company", e.target.value)
                }
                placeholder="Company"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`exp-from-${x.id}`}
                value={x.from}
                onChange={(e) =>
                  updateExperience(x.id, "from", e.target.value)
                }
                placeholder="From"
                type="month"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`exp-to-${x.id}`}
                value={x.to}
                onChange={(e) =>
                  updateExperience(x.id, "to", e.target.value)
                }
                placeholder="To"
                type="month"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`exp-summary-${x.id}`}
                value={x.summary}
                onChange={(e) =>
                  updateExperience(x.id, "summary", e.target.value)
                }
                placeholder="Highlights (use ; for new lines)"
                multiline
              />
            </div>
          </>
        )}
        onAdd={addExperience}
        onRemove={removeExperience}
      />
    </Panel>
  );
};

export default ExperiencePanel;
