// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@touring.uoxy8h0.mongodb.net/?retryWrites=true&w=majority&appName=touring`;


// const uri2 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@another.giaqna9.mongodb.net/?retryWrites=true&w=majority&appName=another`;


// const uri3 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@touring.uoxy8h0.mongodb.net/?retryWrites=true&w=majority&appName=touring`;


// const uri4 = ;


function mongoMini(user, password, cluster, clusterCode) {
return `mongodb+srv://${user}:${password}@${cluster}.${clusterCode}.mongodb.net/?retryWrites=true&w=majority&appName=${cluster}`
}

module.exports = {mongoMini}