
export function userHasVotedTheProposal(userInfo: any, proposal: any): boolean {

    console.log(userInfo)

    let user_that_have_voted = [];

    if (userInfo[0] == true) {

        user_that_have_voted = proposal.professorsThatHaveVoted

    } else {

        user_that_have_voted = proposal.studentsThatHaveVoted
    }

    const id = userInfo[1].id

    return user_that_have_voted.includes(id)
}


