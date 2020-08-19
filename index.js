// apollo-serverモジュールを読み込む
const { ApolloServer } = require(`apollo-server`)

// 写真を格納するための配列
var photos = []
// ユニークIDをインクリメントするための変数
var _id = 0

const typeDefs = `
	enum PhotoCategory {
		SELFIE
		PORTRAIT
		ACTION
		LANDSCAPE
		GRAPHIC
	}

	type Photo {
		id: ID!
		url: String!
		name: String!
		description: String
		category: PhotoCategory!
	}

	input PostPhotoInput {
		name: String!
		category: PhotoCategory=PORTRAIT
		description: String
	}

	type Query {
		totalPhotos: Int!
		allPhotos: [Photo!]!
	}

	type Mutation {
		postPhoto(input: PostPhotoInput!): Photo!
	}
`

const resolvers = {
	Query: {
		totalPhotos: () => photos.length,
		allPhotos: () => photos
	},

	Mutation: {
		postPhoto(parent, args) {
			var newPhoto = {
				id: _id++,
				...args.input
			}
			photos.push(newPhoto)
			return newPhoto
		}
	},

	Photo: {
		url: parent => `http://yoursite.com/img/${parent.id}.jpg`
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