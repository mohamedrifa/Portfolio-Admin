import React from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";
import RemoveButton from "./utilities/RemoveButton";

const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

const emptyCustomSection = () => ({
  id: genId(),
  title: "",
  items: [{ id: genId(), heading: "", description: "" }],
});

const CustomSectionPanel = ({ customSections, setCustomSections }) => {

  const addSection = () => {
    setCustomSections((prev) => [...prev, emptyCustomSection()]);
  };

  const removeSection = (sectionId) => {
    setCustomSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    );
  };

  const updateSection = (sectionId, type, ...args) => {
    setCustomSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        // Update section title
        if (type === "title") {
          return { ...section, title: args[0] };
        }
        if (type === "addItem") {
          return {
            ...section,
            items: [
              ...section.items,
              { id: genId(), heading: "", description: "" },
            ],
          };
        }
        if (type === "removeItem") {
          const [itemId] = args;
          return {
            ...section,
            items: section.items.filter((item) => item.id !== itemId),
          };
        }
        if (type === "items") {
          const [itemId, field, value] = args;
          console.log(args);
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          };
        }
        return section;
      })
    );
  };

  return (
    <>
      <Panel title="Custom Sections" hint="Add your own sections and items">
        {customSections.map((section) => (
          <React.Fragment key={section.id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <InputField
                id={`section-title-${section.id}`}
                value={section.title}
                onChange={(e) =>
                  updateSection(section.id, "title", e.target.value)
                }
                placeholder="Section Title"
              />
              <RemoveButton onClick={() => removeSection(section.id)} />
            </div>

            <TableLike
              headers={["Item Title", "Item Description"]}
              rows={section.items}
              renderRow={(item) => (
                <React.Fragment key={item.id}>
                  <div style={{ flex: 1 }}>
                    <InputField
                      id={`item-heading-${item.id}`}
                      value={item.heading}
                      onChange={(e) =>
                        updateSection(
                          section.id,
                          "items",
                          item.id,
                          "heading",
                          e.target.value
                        )
                      }
                      placeholder="Item Title"
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <InputField
                      id={`item-desc-${item.id}`}
                      value={item.description}
                      onChangeText={(e) =>
                        updateSection(
                          section.id,
                          "items",
                          item.id,
                          "description",
                          e
                        )
                      }
                      placeholder="Item Description"
                      multiline
                    />
                  </div>
                </React.Fragment>
              )}
              onAdd={() => updateSection(section.id, "addItem")}
              onRemove={(itemId) => updateSection(section.id, "removeItem", itemId)}
            />
          </React.Fragment>
        ))}
      </Panel>

      <div style={{ marginTop: 12, width: "100%", textAlign: "center" }}>
        <button onClick={addSection}>+ Add New Section</button>
      </div>
    </>
  );
};

export default CustomSectionPanel;
