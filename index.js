// apollo-serverモジュールを読み込む
const { ApolloServer } = require(`apollo-server`)

// 写真を格納するための配列
var photos = []

const typeDefs = `
	type Query {
		totalPhotos: Int!
	}

	type Mutation {
		postPhoto(name: String! description: String): Boolean!
	}
`

const resolvers = {
	Query: {
		totalPhotos: () => photos.length
	},

	Mutation: {
		postPhoto(parent, args) {
			photos.push(args)
			return true
		}
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