// ResumeForm.jsx
import React, { useEffect, useState, useCallback, memo } from "react";
import "./resume-form.css";
import InputField from "../InputField";
import { useAuth } from "../../services/auth";
import { db } from "../../config/firebase";
import { ref, update, get, child } from "firebase/database";
import ImagePicker from "./ImagePicker";

/* ---------- helpers ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const emptyEdu   = () => ({ id: uid(), stream: "", from: "", to: "", percentage: "", institute: "" });
const emptyExp   = () => ({ id: uid(), role: "", location: "", company: "", from: "", to: "", summary: "" });
const emptyProj  = () => ({ id: uid(), title: "", stack: "", description: "", image: "", link: "" });
const emptyCert  = () => ({ id: uid(), name: "", link: "" });
const emptyLang  = () => ({ id: uid(), language: "", proficiency: "" });

/* ---------- Small subcomponents ---------- */
const SectionHead = ({ title, hint }) => (
  <div className="panel__head">
    <h3>{title}</h3>
    {hint ? <div className="panel__hint" dangerouslySetInnerHTML={{ __html: hint }} /> : null}
  </div>
);

/* Memoized Panel wrapper */
const Panel = memo(({ title, hint, children }) => (
  <div className="panel">
    <SectionHead title={title} hint={hint} />
    {children}
  </div>
));

/* PersonalInfo component */
const PersonalSection = memo(({ data, onChange }) => (
  <Panel title="Personal Information">
    <div className="grid grid-3">
      <InputField
        id="full-name"
        label="Full Name"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="e.g., Priya Sharma"
      />
      <InputField
        id="title"
        label="Professional Title"
        value={data.title}
        onChange={(e) => onChange("title", e.target.value)}
        placeholder="e.g., Frontend Developer"
      />
      <InputField
        id="phone"
        label="Phone"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        type="tel"
        placeholder="e.g., +91 98xxxxxxxx"
      />
    </div>

    <div className="grid grid-2">
      <InputField
        id="email"
        label="E-mail"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="you@example.com"
      />
      <InputField
        id="git"
        label="GitHub / Others"
        value={data.git}
        onChange={(e) => onChange("git", e.target.value)}
        placeholder="github.com/username"
      />
    </div>

    <div className="grid grid-2">
      <InputField
        id="linkedin"
        label="LinkedIn"
        value={data.linkedIn}
        onChange={(e) => onChange("linkedIn", e.target.value)}
        placeholder="linkedin.com/in/username"
      />
      <ImagePicker value={data.profile} onChange={(val) => onChange("profile", val)} />
    </div>

    <InputField
      id="address"
      label="Address"
      value={data.address}
      onChange={(e) => onChange("address", e.target.value)}
      placeholder="City, State, Country"
      multiline
    />
  </Panel>
));

/* ---------- TableLike ---------- */
const TableLike = memo(({title, headers, rows, renderRow, onAdd, onRemove }) => (
  <div
    className="tablelike"
    style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
  >
    <div
      className="tablelike__table"
      style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div
        className="tablelike__row tablelike__row--header"
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          background: '#0e134b',
          color: 'white',
          padding: '8px',
          borderRadius: '6px',
        }}
      >
        { title === "projects" &&
          <div className="tablelike__cell" style={{ width: 100, textAlign: 'center' }}>Image</div>
        }
        {headers.map((h, i) => (
          <div key={i} className="tablelike__cell" style={{ flex: 1, textAlign: 'center' }}>{h}</div>
        ))}
        <div className="tablelike__cell" style={{ width: '50px' }} />
      </div>

      {rows.map((row) => (
        <div
          className="tablelike__row"
          key={row.id}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            padding: '8px',
            borderRadius: '6px',
          }}
        >
          <div style={{ display: 'flex', flex: 1, gap: '8px' }}>{renderRow(row)}</div>
          <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => onRemove(row.id)}
              style={{
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
                color: '#ef4444',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className="tablelike__head">
      <button
        type="button"
        onClick={onAdd}
        style={{
          background: 'none',
          border: 'none',
          color: '#0e134b',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px',
          padding: 0,
        }}
      >
        + Add new record
      </button>
    </div>
  </div>
));


const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === "object") return Object.values(val);
  if (typeof val === "string") {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
};

const normalizeEducation = (raw) => {
  const arr = ensureArray(raw);
  return (arr.length ? arr : [emptyEdu()]).reverse().map((e) => ({
    id: uid(),
    stream: e.stream || e.degree || "",
    from: e.from || e.start || "",
    to: e.to || e.end || "",
    percentage: e.percentage || e.cgpa || "",
    institute: e.institute || e.school || e.college || e.name || "",
  }));
};
const normalizeExperience = (raw) => {
  const arr = ensureArray(raw);
  return (arr.length ? arr : [emptyExp()]).reverse().map((x) => ({
    id: uid(),
    role: x.role || "",
    location: x.location || x.mode || "",
    company: x.company || "",
    from: x.from || "",
    to: x.to || "",
    summary: x.summary || "",
  }));
};
const normalizeProjects = (raw) => {
  const arr = ensureArray(raw);
  return (arr.length ? arr : [emptyProj()]).reverse().map((p) => ({
    id: uid(),
    title: p.title || p.name || "",
    stack: p.stack || "",
    description: p.description || "",
    image: p.image || "",
    link: p.link || "",
  }));
};
const normalizeCertifications = (raw) => {
  const arr = ensureArray(raw);
  return (arr.length ? arr : [emptyCert()]).reverse().map((c) => ({
    id: uid(),
    name: c.name || c.title || c.certificate || c || "",
    link: c.link || ""
  }));
};
const normalizeLanguages = (raw) => {
  const arr = ensureArray(raw);
  const toNum = (v) => {
    const n = Number(String(v || "").replace(/[^\d.-]/g, ""));
    if (Number.isNaN(n)) return "";
    return Math.max(0, Math.min(100, Math.round(n)));
  };
  return (arr.length ? arr : [emptyLang()]).reverse().map((l) => ({
    id: uid(),
    language: l.language || l.name || "",
    proficiency: l.proficiency === "" || l.proficiency === undefined ? "" : toNum(l.proficiency),
  }));
};

/* ---------- Main component ---------- */
export default function ResumeForm() {
  const [loader, setLoader] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    email: "",
    git: "",
    linkedIn: "",
    phone: "",
    address: "",
    profile: "",
  });

  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState([emptyEdu()]);
  const [experience, setExperience] = useState([emptyExp()]);
  const [projects, setProjects] = useState([emptyProj()]);
  const [certifications, setCertifications] = useState([emptyCert()]);
  const [languages, setLanguages] = useState([emptyLang()]);
  const [resumeColor, setResumeColor] = useState("#0b7285");

  const updatePersonalInfo = useCallback((key, value) => {
    setPersonalInfo(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const makeUpdate = (setFn) => (id, field, value) => {
    setFn(prev => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const makeAdd = (setFn, factory) => () => setFn(prev => [...prev, factory()]);
  const makeRemove = (setFn) => (id) => setFn(prev => prev.filter((item) => item.id !== id));

  const updateEducation = makeUpdate(setEducation);
  const addEducation = makeAdd(setEducation, emptyEdu);
  const removeEducation = makeRemove(setEducation);

  const updateExperience = makeUpdate(setExperience);
  const addExperience = makeAdd(setExperience, emptyExp);
  const removeExperience = makeRemove(setExperience);

  const updateProjects = makeUpdate(setProjects);
  const addProject = makeAdd(setProjects, emptyProj);
  const removeProject = makeRemove(setProjects);

  const updateCertifications = makeUpdate(setCertifications);
  const addCertification = makeAdd(setCertifications, emptyCert);
  const removeCertification = makeRemove(setCertifications);

  const updateLanguages = makeUpdate(setLanguages);
  const addLanguage = makeAdd(setLanguages, emptyLang);
  const removeLanguage = makeRemove(setLanguages);

  const { user } = useAuth();
  const uid = user?.uid;


  const setFromObj = (d = {}) => {
    setPersonalInfo({
      name: d.name || "",
      title: d.title || "",
      email: d.email || "",
      git: d.git || "",
      linkedIn: d.linkedIn || "",
      phone: d.phone || "",
      address: d.address || "",
      profile: d.profile || "",
    });
    setResumeColor(d.resumeColor || "#0b7285")
    setSummary(d.summary || "");
    setSkills(
  Array.isArray(d.skills)
    ? d.skills.join("; ").replace(/<strong>(.*?)<\/strong>/g, '""$1""')
    : (d.skills || "").replace(/<strong>(.*?)<\/strong>/g, '""$1""')
);

    setEducation(normalizeEducation(d.education));
    setExperience(normalizeExperience(d.experience));
    setProjects(normalizeProjects(d.projects));
    setCertifications(normalizeCertifications(d.certifications));
    setLanguages(normalizeLanguages(d.languages));
  };

  useEffect(() => {
    if (!uid) return;
    setLoader(true);
    get(child(ref(db), `users/${uid}`))
      .then((snap) => {
        if (snap.exists()) {
          setFromObj(snap.val());
        }
      })
      .catch(console.warn)
      .finally(() => setLoader(false));
  }, [uid]);

  const onlyDigits = (val) => {
    if (val == null) return "";   
    const s = typeof val === "string" ? val : String(val);
    return s.replace(/\D+/g, "");            
  };

  const clamp0to100 = (num) => {
    const n = Number(num);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  };

  const save = async () => {
    setLoader(true);
    try {
      const payload = {
        ...personalInfo,
      projects: [...projects].reverse().map(({ id, ...rest }) => rest),
      education: [...education].reverse().map(({ id, ...rest }) => rest),
      experience: [...experience].reverse().map(({ id, ...rest }) => rest),
      certifications: [...certifications].reverse().map(({ id, ...rest }) => rest),
      resumeColor,
      skills: String(skills)
        .replace(/""([^"]+)""/g, "<strong>$1</strong>")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: [...(languages || [])]
        .reverse()
        .map((l) => ({
          language: (l.language || "").trim(),
          proficiency:
            l.proficiency === "" || l.proficiency === undefined
              ? ""
              : clamp0to100(Number(onlyDigits(l.proficiency))),
        }))
        .filter((l, idx, arr) => l.language || l.proficiency !== "" || arr.length === 1),
      };
      await update(ref(db, `users/${uid}`), payload);
      alert("Your resume was updated successfully!");
    } catch (err) {
      alert("Save failed" + err.message);
    } finally{
      setLoader(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="page">
      <main className="content">
        <PersonalSection
          data={{ ...personalInfo, summary }}
          onChange={(k, v) => (k === "summary" ? setSummary(v) : updatePersonalInfo(k, v))}
        />

        <Panel title="Summary">
          <InputField
            id="summary"
            label="About you"
            placeholder="Brief overview of your experience and goals."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            multiline
          />
        </Panel>

        <Panel title="Skills" hint='Separate with “;” – supports <strong>bold</strong>'>
          <InputField
            id="skills"
            label="Skills"
            placeholder="e.g., JavaScript; React; Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            multiline
          />
        </Panel>

        {/* ---------- Projects ---------- */}
        <Panel title="Projects" hint='Use “;” for line breaks in Description'>
          <TableLike
            title = "projects"
            headers={["Title", "Stack / Tech", "Description", "Link"]}
            rows={projects}
            renderRow={(p) => (
              <>
              <div style={{ width: 95 }}>
                <ImagePicker value={p.image} onChange={(val) => updateProjects(p.id, "image", val)} /></div>
                <div style={{ flex: 1 }}>
                  <InputField
                    id={`proj-title-${p.id}`}
                    value={p.title}
                    onChange={(e) => updateProjects(p.id, "title", e.target.value)}
                    placeholder="Project title"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField
                    id={`proj-stack-${p.id}`}
                    value={p.stack}
                    onChange={(e) => updateProjects(p.id, "stack", e.target.value)}
                    placeholder="Tech stack"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField
                    id={`proj-desc-${p.id}`}
                    value={p.description}
                    onChange={(e) => updateProjects(p.id, "description", e.target.value)}
                    placeholder="Short description (use ; for new lines)"
                    multiline
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField
                    id={`proj-desc-${p.id}`}
                    value={p.link}
                    onChange={(e) => updateProjects(p.id, "link", e.target.value)}
                    placeholder="https://www.example.com"
                  />
                </div>
              </>
            )}
            onAdd={addProject}
            onRemove={removeProject}
          />
        </Panel>

        {/* ---------- Experience ---------- */}
        <Panel title="Experience" hint='Use “;” for line breaks in Summary'>
          <TableLike
            headers={["Role", "Location / Mode", "Company", "From", "To", "Summary"]}
            rows={experience}
            renderRow={(x) => (
              <>
                <div style={{ flex: 1 }}><InputField id={`exp-role-${x.id}`} value={x.role} onChange={(e) => updateExperience(x.id, "role", e.target.value)} placeholder="Role" /></div>
                <div style={{ flex: 1 }}><InputField id={`exp-location-${x.id}`} value={x.location} onChange={(e) => updateExperience(x.id, "location", e.target.value)} placeholder="Location / Remote" /></div>
                <div style={{ flex: 1 }}><InputField id={`exp-company-${x.id}`} value={x.company} onChange={(e) => updateExperience(x.id, "company", e.target.value)} placeholder="Company" /></div>
                <div style={{ flex: 1 }}><InputField id={`exp-from-${x.id}`} value={x.from} onChange={(e) => updateExperience(x.id, "from", e.target.value)} placeholder="From" type="month" /></div>
                <div style={{ flex: 1 }}><InputField id={`exp-to-${x.id}`} value={x.to} onChange={(e) => updateExperience(x.id, "to", e.target.value)} placeholder="To" type="month" /></div>
                <div style={{ flex: 1 }}><InputField id={`exp-summary-${x.id}`} value={x.summary} onChange={(e) => updateExperience(x.id, "summary", e.target.value)} placeholder="Highlights (use ; for new lines)" multiline /></div>
              </>
            )}
            onAdd={addExperience}
            onRemove={removeExperience}
          />
        </Panel>

        {/* ---------- Education ---------- */}
        <Panel title="Education">
          <TableLike
            headers={["Course / Stream", "Institution", "From", "To", "Percentage / CGPA"]}
            rows={education}
            renderRow={(e) => (
              <>
                <div style={{ flex: 1 }}><InputField id={`edu-stream-${e.id}`} value={e.stream} onChange={(ev) => updateEducation(e.id, "stream", ev.target.value)} placeholder="Course / Stream" /></div>
                <div style={{ flex: 1 }}><InputField id={`edu-institute-${e.id}`} value={e.institute} onChange={(ev) => updateEducation(e.id, "institute", ev.target.value)} placeholder="Institution" /></div>
                <div style={{ flex: 1 }}><InputField id={`edu-from-${e.id}`} value={e.from} onChange={(ev) => updateEducation(e.id, "from", ev.target.value)} placeholder="From" type="month" /></div>
                <div style={{ flex: 1 }}><InputField id={`edu-to-${e.id}`} value={e.to} onChange={(ev) => updateEducation(e.id, "to", ev.target.value)} placeholder="To" type="month" /></div>
                <div style={{ flex: 1 }}><InputField id={`edu-perc-${e.id}`} value={e.percentage} onChange={(ev) => updateEducation(e.id, "percentage", ev.target.value)} placeholder="Percentage / CGPA" type="text" /></div>
              </>
            )}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        </Panel>

        {/* ---------- Languages ---------- */}
        <Panel title="Languages" hint="Proficiency: 0–100">
          <TableLike
            headers={["Language", "Proficiency (0–100)"]}
            rows={languages}
            renderRow={(l) => (
              <>
                <div style={{ flex: 1 }}><InputField id={`lang-${l.id}`} value={l.language} onChange={(e) => updateLanguages(l.id, "language", e.target.value)} placeholder="Language" /></div>
                <div style={{ flex: 1 }}><InputField
                  id={`lang-prof-${l.id}`}
                  value={l.proficiency}
                  onChange={(e) => {
                    const digits = String(e.target.value).replace(/[^\d]/g, "");
                    const n = digits === "" ? "" : Math.max(0, Math.min(100, Number(digits)));
                    updateLanguages(l.id, "proficiency", n);
                  }}
                  placeholder="0–100"
                  type="number"
                /></div>
              </>
            )}
            onAdd={addLanguage}
            onRemove={removeLanguage}
          />
        </Panel>

        {/* ---------- Certifications ---------- */}
        <Panel title="Certifications">
          <TableLike
            headers={["Certificate Name", "Link"]}
            rows={certifications}
            renderRow={(c) => (
              <>
              <div style={{ flex: 1 }}><InputField id={`cert-${c.id}`} value={c.name} onChange={(e) => updateCertifications(c.id, "name", e.target.value)} placeholder="e.g., AWS Certified Practitioner" /></div>
              <div style={{ flex: 1 }}><InputField id={`cert-${c.id}`} value={c.link} onChange={(e) => updateCertifications(c.id, "link", e.target.value)} placeholder="https://www.example.com" /></div>
              </>
            )}
            onAdd={addCertification}
            onRemove={removeCertification}
          />
        </Panel>

        <div className="actions" style={{ position: 'sticky', right: 10, bottom: 10 }}>
          <button
            className="btn"
            type="button"
            onClick={save}
            disabled={loader}
            style={{
              opacity: loader ? 0.6 : 1,
              cursor: loader ? 'not-allowed' : 'pointer',
            }}
          >
            {loader ? "Loading..." : "Save changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
