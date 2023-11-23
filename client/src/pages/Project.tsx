import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { FaEnvelope, FaPhone, FaIdBadge, FaTrash } from "react-icons/fa6";
import { GET_PROJECT_BY_ID, GET_PROJECTS } from "../queries/projectQueries";
import { DELETE_PROJECT, UPDATE_PROJECT } from "../mutations/projectMutations";
import Spinner from "../components/Spinner";
import { useState } from "react";

export default function Project() {
	const { id } = useParams();
	const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
		variables: { id },
	});

	if (loading) return <Spinner />;
	if (error) return <p>Something Went Wrong...</p>;

	return (
		<div className="mx-auto w-75 card p-5">
			<Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">
				Back
			</Link>
			<h1>{data.project.name}</h1>
			<p>{data.project.description}</p>

			<h5 className="mt-3">Project Status</h5>
			<p className="lead">{data.project.status}</p>
			<ClientInfo client={data.project.client} />
			<EditProjectForm project={data.project} />
			<DeleteProjectButton id={data.project.id} />
		</div>
	);
}

function ClientInfo({ client }: { client: any }) {
	return (
		<>
			<h5 className="mt-5">Client Info</h5>
			<ul className="list-group">
				<li className="list-group-item">
					<FaIdBadge className="icon" /> {client.name}
				</li>
				<li className="list-group-item">
					<FaEnvelope className="icon" /> {client.email}
				</li>
				<li className="list-group-item">
					<FaPhone className="icon" /> {client.phone}
				</li>
			</ul>
		</>
	);
}

function DeleteProjectButton({ id }: { id: string }) {
	const navigate = useNavigate();

	const [deleteProject] = useMutation(DELETE_PROJECT, {
		variables: { id },
		onCompleted: () => navigate("/"),
		refetchQueries: [{ query: GET_PROJECTS }],
	});

	return (
		<div className="d-flex mt-5 ms-auto">
			{/* @ts-expect-error */}
			<button className="btn btn-danger mt-2" onClick={deleteProject}>
				<FaTrash /> Delete Project
			</button>
		</div>
	);
}

function EditProjectForm({ project }: { project: any }) {
	const [name, setName] = useState(project.name);
	const [description, setDescription] = useState(project.description);
	const [status, setStatus] = useState(() => {
		switch (project.status) {
			case "Backlog":
				return "backlog";
			case "In Progress":
				return "progress";
			case "In Review":
				return "review";
			case "Done":
				return "done";
			default:
				throw new Error(`Unknown status: ${project.status}`);
		}
	});

	const [updateProject] = useMutation(UPDATE_PROJECT, {
		variables: {
			id: project.id,
			name,
			description,
			status,
		},
		refetchQueries: [
			{ query: GET_PROJECT_BY_ID, variables: { id: project.id } },
		],
	});

	function onSubmit(e: any) {
		e.preventDefault();
		if (!name || !description || !status) {
			return alert("absolutely not");
		}
		updateProject();
	}

	return (
		<div className="mt-5">
			<h3>Update Project Details</h3>
			<form onSubmit={onSubmit}>
				<div className="mb-3">
					<label className="form-label">Name</label>
					<input
						type="text"
						className="form-control"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Description</label>
					<textarea
						className="form-control"
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Status</label>
					<select
						id="status"
						value={status}
						className="form-select"
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value="backlog">Backlog</option>
						<option value="progress">In Progress</option>
						<option value="review">In Review</option>
						<option value="done">Done</option>
					</select>
				</div>
				<button
					type="submit"
					className="btn btn-primary"
					// @ts-expect-error
					onClick={updateProject}
				>
					Submit
				</button>
			</form>
		</div>
	);
}
