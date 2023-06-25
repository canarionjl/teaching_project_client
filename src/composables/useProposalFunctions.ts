
export function userHasVotedTheProposal(userInfo:any, proposal: any): boolean {

    let user_that_have_voted = [];

   while(userInfo == null)

    if (userInfo [0] == true) {
        user_that_have_voted = proposal.professorsThatHaveVoted
    } else {
        user_that_have_voted = proposal.studentsThatHaveVoted
    }

    const id = userInfo[1].id 

    return user_that_have_voted.includes(id)
}


