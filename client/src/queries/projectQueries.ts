import { gql } from '@apollo/client'

export const GET_PROJECTS = gql`
    query getProjects {
        projects {
            name,
            id,
            description,
            status
        }
    }
`

export const GET_PROJECT_BY_ID = gql`
    query getProject($id: ID!) {
        project(id: $id) {
            id
            name
            description
            status
            client {
                id
                name
                email
                phone
            }
        }
    } 
`
