const ResumePreview = ({ data, sectionOrder }) => {
  return (
    <div className="p-10 text-gray-900 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">{data.personal.name}</h1>
        <p className="text-gray-600">{data.personal.title}</p>
      </div>

      {/* SECTIONS */}
      {sectionOrder
        .filter((s) => s.visible)
        .map((section) => {
          if (section.id === "summary") {
            return (
              <section key={section.id}>
                <h2 className="font-semibold border-b mb-2">
                  {section.label}
                </h2>
                <p className="text-sm text-gray-700">
                  {data.personal.summary}
                </p>
              </section>
            );
          }

          if (section.id === "experience") {
            return (
              <section key={section.id}>
                <h2 className="font-semibold border-b mb-2">
                  {section.label}
                </h2>
                {data.experience.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="font-medium">{exp.role}</div>
                    <div className="text-sm text-gray-600">
                      {exp.company} · {exp.year}
                    </div>
                    <p className="text-sm">{exp.details}</p>
                  </div>
                ))}
              </section>
            );
          }

          if (section.id === "education") {
            return (
              <section key={section.id}>
                <h2 className="font-semibold border-b mb-2">
                  {section.label}
                </h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <div className="font-medium">{edu.institution}</div>
                    <div className="text-sm text-gray-600">
                      {edu.degree} · {edu.year}
                    </div>
                    <p className="text-sm">{edu.details}</p>
                  </div>
                ))}
              </section>
            );
          }

          if (section.id === "skills") {
            return (
              <section key={section.id}>
                <h2 className="font-semibold border-b mb-2">
                  {section.label}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-gray-200 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "achievements") {
            return (
              <section key={section.id}>
                <h2 className="font-semibold border-b mb-2">
                  {section.label}
                </h2>
                <ul className="list-disc ml-5 text-sm">
                  {data.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </section>
            );
          }

          if (section.id === "community") {
            return (
              <section key={section.id}>
                <h2 className="font-semibold border-b mb-2">
                  {section.label}
                </h2>
                <ul className="list-disc ml-5 text-sm">
                  {data.community.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            );
          }

          return null;
        })}
    </div>
  );
};

export default ResumePreview;
