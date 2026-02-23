import { CONTACT_MAILTO, EXTERNAL_LINK_PROPS } from "../constants/appConstants";

function HeroActions() {
  const actions = [
    {
      className: "button hero-btn cv",
      href: `${import.meta.env.BASE_URL}Rob-Walsh-CV.pdf`,
      label: "View CV",
      external: true
    },
    {
      className: "button hero-btn github",
      href: "https://github.com/Rob-Jay",
      label: "GitHub",
      external: true
    },
    {
      className: "button hero-btn linkedin",
      href: "https://www.linkedin.com/in/robert-walsh-937703218/",
      label: "LinkedIn",
      external: true
    },
    {
      className: "button hero-btn contact",
      href: CONTACT_MAILTO,
      label: "Contact",
      external: false
    }
  ];

  return (
    <div className="hero-actions">
      {actions.map((action) => (
        <a
          key={action.label}
          className={action.className}
          href={action.href}
          {...(action.external ? EXTERNAL_LINK_PROPS : {})}
        >
          {action.label}
        </a>
      ))}
    </div>
  );
}

export default HeroActions;
