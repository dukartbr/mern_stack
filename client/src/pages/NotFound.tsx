import { FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center mt-5">
			<FaTriangleExclamation className="text-danger" size="5em" />
			<h1>404</h1>
			<p className="lead">Sorry, this page does not exist</p>
			<Link to="/" className="btn btn-primary">
				Get Outta Here
			</Link>
		</div>
	);
}
