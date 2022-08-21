import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { withNoAuth } from "../../authGuards/withNoAuth";
import { Loading } from "../../components/Commons/Loading";
import { FormInputField } from "../../components/Forms/FormInputField";
import { COMPLETE_REGISTRATION, DASHBOARD_URL, FETCH_POTENTIAL_USER_DATA, NEW_USER_WELCOME_URL } from "../../config/ScreenRoutes";
import { apolloClient } from "../../graphql";

type Response = {
    "entityId": string,
    "name": string | null,
    "email": string,
    "avatar_url": string,
    // there are few more fields but we don't need them
}

const Persevere = () => {
    // fetch data

    const [potentialUserData, setPotentialUserData] = useState<Response>()

    useEffect(() => {
        fetch(FETCH_POTENTIAL_USER_DATA, {
            method: 'GET',
        }).then(e => e.json())
            .then(jsonData => {
                if(jsonData.error){
                    throw new Error(jsonData.message)
                }else{
                    setPotentialUserData(jsonData.data)
                }
            }).catch(err => {
                console.log(err)
                toast(err.message, {type: "error"})
                router.push(NEW_USER_WELCOME_URL)
            })
    }, [])

    const router=useRouter()

    const handleSubmit = async (data: {
        name: string;
        email: string;
        id: string;
    }) => {
        try{
            const response=await fetch(COMPLETE_REGISTRATION, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    "Content-Type":"application/json"
                })
            })
            const json=await response.json()
            if(json.error) throw new Error(json.message)

            apolloClient.refetchQueries({
                include: "all"
            })
            router.push(DASHBOARD_URL)
        }catch(err){
            toast((err as any).message, {type: 'error'})
        }
    }

    return (
        <div>

            {potentialUserData === undefined && <Loading text="Fetching the registration state... ⟨䷄⟩" />}

            {potentialUserData && <div className="form-container">
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={
                        {
                            name: potentialUserData.name ?? "",
                            email: potentialUserData.email,
                            id: "",
                        }
                    }
                >
                    <Form>
                        <h1 className="text-2xl font-black mb-8 mt-4 text-center">Complete Registration</h1>
                        <div className="flex justify-center">
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={potentialUserData.avatar_url} />
                                </div>
                            </div>
                        </div>

                        <FormInputField fieldId="name" fieldLabel="Full Name" />
                        <FormInputField fieldId="email" fieldLabel="Email" disabled />
                        <div>
                            <FormInputField fieldId="id" fieldLabel="Unique Wall ID" />
                            <div className="text-2xs text-gray-500">Aka username. Be creative to make it unique. 🙂</div>
                        </div>


                        <button className="btn mt-5 btn-sm text-sm">Join</button>
                    </Form>
                </Formik>
            </div>}

        </div>
    )
}

export default withNoAuth(Persevere);
