import React from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";

const LanguagesPanel = ({
  languages,
  addLanguage,
  removeLanguage,
  updateLanguages,
}) => {
  return (
    <Panel title="Languages" hint="Proficiency: 0–100">
      <TableLike
        headers={["Language", "Proficiency (0–100)"]}
        rows={languages}
        renderRow={(l) => (
          <>
            <div style={{ flex: 1 }}>
              <InputField
                id={`lang-${l.id}`}
                value={l.language}
                onChange={(e) =>
                  updateLanguages(l.id, "language", e.target.value)
                }
                placeholder="Language"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`lang-prof-${l.id}`}
                value={l.proficiency}
                onChange={(e) => {
                  const digits = String(e.target.value).replace(/[^\d]/g, "");
                  const n =
                    digits === ""
                      ? ""
                      : Math.max(0, Math.min(100, Number(digits)));
                  updateLanguages(l.id, "proficiency", n);
                }}
                placeholder="0–100"
                type="number"
              />
            </div>
          </>
        )}
        onAdd={addLanguage}
        onRemove={removeLanguage}
      />
    </Panel>
  );
};

export default LanguagesPanel;
