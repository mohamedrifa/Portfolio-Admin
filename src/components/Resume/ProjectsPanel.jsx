import React, { useState, useEffect } from "react";
import Panel from "./utilities/Panel";
import TableLike from "./utilities/TableLike";
import InputField from "./utilities/InputField";
import ImagePicker from "./utilities/ImagePicker";
import { db } from "../../config/firebase";
import { ref, update, child, get } from "firebase/database";
import { useAuth } from "../../services/auth";

const ProjectsPanel = ({
  projects,
  addProject,
  removeProject,
  updateProjects,
}) => {

  const [images, setImages] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const { user } = useAuth();
  const uid = user?.uid;

  const updateImage = async (firebaseIndex, value) => {
    setUploadingId(firebaseIndex);
    try {
      await update(
        ref(db, `users/${uid}/projects/${firebaseIndex}`),
        { image: value }
      );
      setImages(prev => ({ ...prev, [firebaseIndex]: value }));
    } finally {
      setUploadingId(null);
    }
  };

  useEffect(() => {
    if (!uid || !projects?.length) return;
    projects.forEach(async (p) => {
      const idx = p.firebaseIndex;
      if (images[idx]) return;
      const snap = await get(
        child(ref(db), `users/${uid}/projects/${idx}/image`)
      );
      if (snap.exists()) {
        setImages(prev => ({ ...prev, [idx]: snap.val() }));
      }
    });
  }, [projects, uid]);

  return (
    <Panel title="Projects" hint='Use “;” for line breaks in Description'>
      <TableLike
        title="projects"
        headers={["Image", "Title", "Stack / Tech", "Description", "Link"]}
        rows={projects}
        renderRow={(p, idx) => (
          <>
            <div style={{ width: 95 }}>
              {uploadingId === p.firebaseIndex  ? (
                <div>Uploading...</div>
              ) : (
                <ImagePicker
                  value={images[p.firebaseIndex] || ""}
                  onChange={(val) => updateImage(p.firebaseIndex, val)}
                />
              )}
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
