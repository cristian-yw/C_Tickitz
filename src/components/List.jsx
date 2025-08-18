import { Link } from "react-router-dom";

/**
 * Digunakan untuk elemen list pada navbar
 * @param {object} props
 * @param {string} props.to - Tujuan Navigasi dari Link
 * @param {string} props.listText - Teks dari Link
 */
function ListItem({ to, listText }) {
  return (
    <li>
      <Link to={to}>{listText}</Link>
    </li>
  );
}

export default ListItem;