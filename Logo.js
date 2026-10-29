// Logo Log Horizon : image envoyée depuis l'admin, sinon badge « LH » par défaut.
// À placer dans un conteneur .brand (flex).
export default function Logo({ url }) {
  return (
    <>
      {url ? <img className="logo-img" src={url} alt="" /> : <span className="badge-lh">LH</span>}
      <span>
        Log<span className="grad">Horizon</span>
      </span>
    </>
  );
}
