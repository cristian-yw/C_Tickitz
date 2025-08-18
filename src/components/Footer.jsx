import { Link } from "react-router-dom";


function Footer() {
  const exploreList = [
    { text: "Cinemas", link: "cinema" },
    { text: "Movies List", link: "/" },
    { text: "My Ticket", link: "/" },
    { text: "Notification", link: "/" },
  ];

  const sponsorList = [
    { text: "ebv.id", src: "/ebv.id 2.png" },
    { text: "CineOne21", src: "/CineOne21 2.png" },
    { text: "hiflix", src: "/hiflix_2.png" },
  ];

  const followUsList = [
    {
      text: "Tickitz Cinema.id",
      link: "facebook.com",
      src: "/eva_facebook-outline.png",
    },

    {
      text: "tickitz.id",
      link: "instagram.com",
      src: "/bx_bxl-instagram.png",
    },

    {
      text: "tickitz.id",
      link: "x.com",
      src: "/eva_twitter-outline.png",
    },

    {
      text: "Tickitz Cinema id",
      link: "youtube.com",
      src: "/feather_youtube.png",
    },
  ];

  return (
    <footer className="flex flex-col gap-10">
      <div className="flex flex-col gap-10 justify-evenly md:flex-row">
        {/* Slogan */}
        <span className="font-light text-[#6E7191] text-sm">
          <img src="/Vector copy.png" alt="" />
          <div>Stop waiting in line. Buy tickets</div>
          <div>conveniently, watch movies quietly.</div>
        </span>

        {/* Explore Link */}
        <span>
          <div className="font-medium text-base">Explore</div>
          <ul className="grid grid-cols-3 md:grid-cols-1">
            {exploreList.map((el, idx) => {
              return (
                <li className="text-sm text-[#6E7191]" key={idx}>
                  <Link to={el.link}>{el.text}</Link>
                </li>
              );
            })}
          </ul>
        </span>

        {/* Sponsor List */}
        <span>
          <div className="font-medium text-base">Our Sponsor</div>
          <ul className="grid grid-cols-3 md:grid-cols-1">
            {sponsorList.map((el, idx) => {
              return (
                <li key={idx}>
                  <img src={el.src} alt={el.text} />
                </li>
              );
            })}
          </ul>
        </span>

        {/* Follow Us */}
        <span>
          <div className="font-medium text-base">Follow us</div>
          <ul className="grid grid-cols-4  md:grid-cols-1">
            {followUsList.map((el, idx) => {
              return (
                <li key={idx}>
                  <a className="flex gap-6" href={el.link}>
                    <img src={el.src} alt="Youtube" />
                    <span className="hidden md:inline ">{el.text}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </span>
      </div>

      <div className="text-[#6E7191]">© 2020 Tickitz. All Rights Reserved.</div>
    </footer>
  );
}

export default Footer;