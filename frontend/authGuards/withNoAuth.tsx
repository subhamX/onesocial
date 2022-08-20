import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { DASHBOARD_URL } from "../config/ScreenRoutes";
import { Query } from "../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import { ErrorScreen } from "../Screens/ErrorScreen";



export const withNoAuth = (WrappedComponent: any): React.FC<any> => {
    // eslint-disable-next-line react/display-name
    return () => {
        const { loading, error, data } = useQuery<Query>(GET_CURRENT_USER)
        const router = useRouter();

        if (loading) {
            return null;
        } else if (error) {
            return <ErrorScreen message={error.message} />;
        } else {
            if (data?.getCurrentUser) {
                // user logged in
                router.push(DASHBOARD_URL);
            } else {
                return <WrappedComponent />;
            }
            return null;
        }
    };
}
