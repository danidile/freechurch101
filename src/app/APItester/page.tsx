import { getChurchTeams } from "@/hooks/GET/getChurchTeams";


export default function Tester () {


    const teams = getChurchTeams("24a8b487-5c81-47c9-8d6c-28fe08a1917c");
    console.log("teams");
    console.log(teams);
}