// ResumeForm.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./resume-form.css";
import InputField from "./utilities/InputField";
import { useAuth } from "../../services/auth";
import { db } from "../../config/firebase";
import { ref, update } from "firebase/database";
import Panel from "./utilities/Panel";
import PersonalSection from "./PersonalSection";
import ProjectsPanel from "./ProjectsPanel";
import ExperiencePanel from "./ExperiencePanel";
import EducationPanel from "./EducationPanel";
import { fetchUserData } from "../../utils/editResume/api";
import LanguagesPanel from "./LanguagesPanel";
import CertificationsPanel from "./CertificationsPanel";
import { normalizeEducation, normalizeExperience, normalizeProjects, normalizeCertifications, normalizeLanguages } from "../../utils/editResume/normalization";
import CustomSectionPanel from "./CustomSectionPanel";

/* ---------- helpers ---------- */
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const emptyEdu   = () => ({ id: genId(), stream: "", from: "", to: "", percentage: "", institute: "" });
const emptyExp   = () => ({ id: genId(), role: "", location: "", company: "", from: "", to: "", summary: "" });
const emptyProj  = () => ({ id: genId(), title: "", stack: "", description: "", image: "", link: "" });
const emptyCert  = () => ({ id: genId(), name: "", link: "" });
const emptyLang  = () => ({ id: genId(), language: "", proficiency: "" });
const emptyCustomSection = () => ({
  id: genId(),
  title: "",
  items: [{ id: genId(), heading: "", description: "" }],
});


/* ---------- Main component ---------- */
export default function ResumeForm() {
  const [loader, setLoader] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    email: "",
    git: "",
    linkedIn: "",
    portfolio: "",
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
  const [QREnabled, setQREnabled] = useState(false);
  const [customSections, setCustomSections] = useState([emptyCustomSection()]);

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
      portfolio: d.portfolio || "",
      phone: d.phone || "",
      address: d.address || "",
      profile: d.profile || "",
    });
    setResumeColor(d.resumeColor || "#0b7285");
    setQREnabled(d.QREnabled || false);
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
    setCustomSections(d.customSections?.map(s => ({
      id: s.id || genId(),
      title: s.title || "",
      items: s.items?.map(item => ({ id: genId(), heading: item.heading || "", description: item.description || "" })) || [],
    })) || [emptyCustomSection()]);
  };

  useEffect(() => {
    if (!uid) return;
    setLoader(true);
    fetchUserData(uid)
      .then((data) => {
        if (data) setFromObj(data);
      })
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
        summary,
        projects: [...projects].reverse().map(({ id, ...rest }) => rest),
        education: [...education].reverse().map(({ id, ...rest }) => rest),
        experience: [...experience].reverse().map(({ id, ...rest }) => rest),
        certifications: [...certifications].reverse().map(({ id, ...rest }) => rest),
        customSections: customSections.map(({ id, items, ...sectionRest }) => ({
  ...sectionRest,
  items: items.map(({ id, ...itemRest }) => itemRest),
})),
        QREnabled,
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

        <Panel title="Skills" hint='Separate with “;” – supports ""<strong>bold</strong>""'>
          <InputField
            id="skills"
            label="Skills"
            placeholder="e.g., JavaScript; React; Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            multiline
          />
        </Panel>

        <h3 style={{ color: "#ffffff93" }}>Note: Enter data in chronological order (oldest to newest)</h3>
        <ProjectsPanel
          projects={projects}
          addProject={addProject}
          removeProject={removeProject}
          updateProjects={updateProjects}
        />

        <ExperiencePanel
          experience={experience}
          addExperience={addExperience}
          removeExperience={removeExperience}
          updateExperience={updateExperience}
        />

        <EducationPanel
          education={education}
          addEducation={addEducation}
          removeEducation={removeEducation}
          updateEducation={updateEducation}
        />

        <LanguagesPanel
          languages={languages}
          addLanguage={addLanguage}
          removeLanguage={removeLanguage}
          updateLanguages={updateLanguages}
        />

        <CertificationsPanel
          certifications={certifications}
          addCertification={addCertification}
          removeCertification={removeCertification}
          updateCertifications={updateCertifications}
        />
        <CustomSectionPanel
          customSections={customSections}
          setCustomSections={setCustomSections}
        />

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
