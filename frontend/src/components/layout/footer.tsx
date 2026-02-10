export function Footer() {
  return (
    <div className="w-full py-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
      <span>Developed by Aidi Khalid |</span>
      <a
        href="https://www.linkedin.com/in/aidikhalid"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary hover:underline"
      >
        LinkedIn
      </a>
      <span> | </span>
      <a
        href="https://github.com/Geevee-101"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary hover:underline"
      >
        Github
      </a>
    </div>
  );
}

export default Footer;
