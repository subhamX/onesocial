import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CHAT_DETAILED_SCREEN } from "../../config/ScreenRoutes";

const MeetDetailed = () => {

  const router = useRouter();
  const buy_instance_id=router.query.id as string;

  useEffect(() => {
    if(buy_instance_id){
      toast.error('Sorry, this feature is not yet available. Redirecting to chat window...');
      router.push(CHAT_DETAILED_SCREEN(buy_instance_id));
    }
  }, [buy_instance_id])

  return (
    <div className="my-10 alert alert-warning">
      The following feature will be available soon.
    </div>
  )
};

export default MeetDetailed;
