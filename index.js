// apollo-serverモジュールを読み込む
const { ApolloServer } = require(`apollo-server`)

const typeDefs = `
	type Query {
		totalPhotos: Int!
	}
`

const resolvers = {
	Query: {
		totalPhotos: () => 42
	}
}

// サーバーのインスタンスを作成
const server = new ApolloServer({
	typeDefs,
	resolvers
})

// Webサーバーを起動
server
	.listen()
	.then(({ url }) => console.log(`GraphQL Service running on ${url}`))