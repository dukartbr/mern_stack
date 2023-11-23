import { useState } from "react";
import { FaList } from "react-icons/fa6";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CLIENT } from "../mutations/clientMutations";
import { ADD_PROJECT } from "../mutations/projectMutations";
import { GET_CLIENTS } from "../queries/clientQueries";
import { GET_PROJECTS } from "../queries/projectQueries";

export default function AddClientModal() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [clientId, setClientId] = useState("");
	const [status, setStatus] = useState("backlog");

	const [addProject] = useMutation(ADD_PROJECT, {
		variables: {
			name,
			description,
			clientId,
			status,
		},
		update(cache, { data: { addProject } }) {
			// @ts-expect-error
			const { projects } = cache.readQuery({ query: GET_PROJECTS });
			cache.writeQuery({
				query: GET_PROJECTS,
				data: { projects: [...projects, addProject] },
			});
		},
	});

	// Get clients for select
	const { loading, error, data } = useQuery(GET_CLIENTS);

	function onSubmit(e: any) {
		e.preventDefault();
		if (!name || !description || !status) {
			return alert("nah sorry");
		}
		addProject();
		setName("");
		setDescription("");
		setStatus("backlog");
	}

	if (loading) return null;
	if (error) return "Something Went Wrong...";

	return (
		<div>
			<button
				type="button"
				className="btn btn-secondary"
				data-bs-toggle="modal"
				data-bs-target="#addProjectModal"
			>
				<div className="d-flex align-items-center">
					<FaList className="icon" />
					<div>New Project</div>
				</div>
			</button>

			<div
				className="modal fade"
				id="addProjectModal"
				aria-labelledby="addProjectModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="addProjectModalLabel">
								Add Project
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
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
								<div className="mb-3">
									<label className="form-label">Client</label>
									<select
										id="clientId"
										value={clientId}
										className="form-select"
										onChange={(e) => setClientId(e.target.value)}
									>
										<option value="">Select Client</option>
										{data.clients.map((client: any) => (
											<option key={client.id} value={client.id}>
												{client.name}
											</option>
										))}
									</select>
								</div>
								<button
									className="btn btn-primary"
									type="submit"
									data-bs-dismiss="modal"
								>
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
