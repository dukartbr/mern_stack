import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../queries/projectQueries";
import Spinner from "./Spinner";

function Projects() {
	const { loading, error, data } = useQuery(GET_PROJECTS);

	console.log("data", data?.projects);
	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong...</p>;
	return (
		<>
			{data.projects.length > 0 ? (
				<div className="row mt-5">
					{data.projects.map((project: any) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			) : (
				<p>No Projects</p>
			)}
		</>
	);
}

export default Projects;

function ProjectCard({ project }: { project: any }) {
	return (
		<div className="col-md-6">
			<div className="card mb-3">
				<div className="card-body">
					<div className="d-flex justify-content-between align-items-center">
						<h5 className="card-title">{project.name}</h5>
						<a className="btn btn-light" href={`/project/${project.id}`}>
							View
						</a>
					</div>
					<p className="small">
						Status: <strong>{project.status}</strong>
					</p>
				</div>
			</div>
		</div>
	);
}
