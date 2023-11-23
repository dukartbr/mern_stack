import { useQuery, useMutation } from "@apollo/client";
import { FaTrash } from "react-icons/fa6";
import { GET_CLIENTS } from "../queries/clientQueries";
import { DELETE_CLIENT } from "../mutations/clientMutations";
import Spinner from "./Spinner";
import { GET_PROJECTS } from "../queries/projectQueries";

export default function Clients() {
	const { loading, error, data } = useQuery(GET_CLIENTS);
	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong</p>;

	return (
		<table className="table table-hover mt-3">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Phone</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{data.clients.map((client: any) => (
					<ClientRow key={client.id} client={client} />
				))}
			</tbody>
		</table>
	);
}

function ClientRow({ client }: { client: any }) {
	const [deleteClient] = useMutation(DELETE_CLIENT, {
		variables: { id: client.id },
		refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }],
	});
	return (
		<tr>
			<td>{client.name}</td>
			<td>{client.email}</td>
			<td>{client.phone}</td>
			<td>
				{/* @ts-expect-error */}
				<button className="btn btn-danger btn-sm" onClick={deleteClient}>
					<FaTrash />
				</button>
			</td>
		</tr>
	);
}
