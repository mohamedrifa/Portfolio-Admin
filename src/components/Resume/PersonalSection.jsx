import React, {memo} from "react";
import Panel from "./utilities/Panel";
import InputField from "./utilities/InputField";
import ImagePicker from "./utilities/ImagePicker";

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
        id="linkedin"
        label="LinkedIn"
        value={data.linkedIn}
        onChange={(e) => onChange("linkedIn", e.target.value)}
        placeholder="linkedin.com/in/username"
      />
    </div>

    <div className="grid grid-3">
      <InputField
        id="git"
        label="GitHub / Others"
        value={data.git}
        onChange={(e) => onChange("git", e.target.value)}
        placeholder="github.com/username"
      />
      <InputField
        id="portfolio"
        label="Portfolio"
        value={data.portfolio}
        onChange={(e) => onChange("portfolio", e.target.value)}
        placeholder="www.example.com"
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

export default PersonalSection;