import React from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";

const CertificationsPanel = ({
  certifications,
  addCertification,
  removeCertification,
  updateCertifications,
}) => {
  return (
    <Panel title="Certifications">
      <TableLike
        headers={["Certificate Name", "Link"]}
        rows={certifications}
        renderRow={(c) => (
          <>
            <div style={{ flex: 1 }}>
              <InputField
                id={`cert-name-${c.id}`}
                value={c.name}
                onChange={(e) =>
                  updateCertifications(c.id, "name", e.target.value)
                }
                placeholder="e.g., AWS Certified Practitioner"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`cert-link-${c.id}`}
                value={c.link}
                onChange={(e) =>
                  updateCertifications(c.id, "link", e.target.value)
                }
                placeholder="https://www.example.com"
              />
            </div>
          </>
        )}
        onAdd={addCertification}
        onRemove={removeCertification}
      />
    </Panel>
  );
};

export default CertificationsPanel;
