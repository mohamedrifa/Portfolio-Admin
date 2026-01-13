import React from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";
import ImagePicker from "./utilities/ImagePicker";

const ProjectsPanel = ({
  projects,
  addProject,
  removeProject,
  updateProjects,
}) => {
  return (
    <Panel title="Projects" hint='Use “;” for line breaks in Description'>
      <TableLike
        title="projects"
        headers={["Image", "Title", "Stack / Tech", "Description", "Link"]}
        rows={projects}
        renderRow={(p) => (
          <>
            <div style={{ width: 95 }}>
              <ImagePicker
                value={p.image}
                onChange={(val) => updateProjects(p.id, "image", val)}
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`proj-title-${p.id}`}
                value={p.title}
                onChange={(e) =>
                  updateProjects(p.id, "title", e.target.value)
                }
                placeholder="Project title"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`proj-stack-${p.id}`}
                value={p.stack}
                onChange={(e) =>
                  updateProjects(p.id, "stack", e.target.value)
                }
                placeholder="Tech stack"
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`proj-desc-${p.id}`}
                value={p.description}
                onChange={(e) =>
                  updateProjects(p.id, "description", e.target.value)
                }
                placeholder="Short description (use ; for new lines)"
                multiline
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                id={`proj-link-${p.id}`}
                value={p.link}
                onChange={(e) =>
                  updateProjects(p.id, "link", e.target.value)
                }
                placeholder="https://www.example.com"
              />
            </div>
          </>
        )}
        onAdd={addProject}
        onRemove={removeProject}
      />
    </Panel>
  );
};

export default ProjectsPanel;
