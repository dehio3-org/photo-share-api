// apollo-serverモジュールを読み込む
const { ApolloServer } = require(`apollo-server`)
const { GraphQLScalarType } = require("graphql")

// 写真を格納するための配列
var photos = [
	{
		"id": "1",
		"name": "Dropping the Heart Chute",
		"description": "The heart chute is one of my favorite chutes",
		"category": "ACTION",
		"githubUser": "gPlake",
		"created": "3-28-1977"
	},
	{
		"id": "2",
		"name": "Enjoying the sunshine",
		"category": "SELFIE",
		"githubUser": "sSchmidt",
		"created": "1-2-1985"
	},
	{
		"id": "3",
		"name": "Gunbarrel 25",
		"description": "25 laps on gunbarrel today",
		"category": "LANDSCAPE",
		"githubUser": "sSchmidt",
		"created": "2018-04-15T19:09:57.308Z"
	}
]
// ユニークIDをインクリメントするための変数
var _id = 0
// ユーザーサンプル
var users = [
	{ "githubLogin": "mHattrup", "name": "Mike Hattrup" },
	{ "githubLogin": "gPlake", "name": "Glen Plake" },
	{ "githubLogin": "sSchmidt", "name": "Scot Schmidt" }
]
// タグサンプル
var tags = [
	{ "PhotoID": "1", "userID": "gPlake" },
	{ "PhotoID": "2", "userID": "sSchmidt" },
	{ "PhotoID": "2", "userID": "mHattrup" },
	{ "PhotoID": "2", "userID": "gPlake" },
]

const serialize = value => new Date(value).toISOString()
const parseValue = value => new Date(value)
const parseLiteral = ast => ast.value

const typeDefs = `
	scalar DateTime

	type User {
		githubLogin: ID!
		name: String
		avatar: String
		postedPhotos: [Photo!]!
		inPhotos: [Photo!]!
	}

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
		postedBy: User!
		taggedUsers: [User!]!
		created: DateTime!
	}

	input PostPhotoInput {
		name: String!
		category: PhotoCategory=PORTRAIT
		description: String
	}

	type Query {
		totalPhotos: Int!
		allPhotos(after: DateTime): [Photo!]!
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
				...args.input,
				created: new Date()
			}
			photos.push(newPhoto)
			return newPhoto
		}
	},

	Photo: {
		url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
		postedBy: parent => {
			return users.find(u => u.githubLogin === parent.githubUser)
		},
		taggedUsers: parent => tags
			.filter(tag => tag.PhotoID === parent.id)
			.map(tag => tag.userID)
			.map(userID => users.find(u => u.githubLogin === userID))
	},

	User: {
		postedPhotos: parent => {
			return photos.filter(p => p.githubUser === parent.githubLogin)
		},
		inPhotos: parent => tags
			.filter(tag => tag.userID === parent.id)
			.map(tag => tag.PhotoID)
			.map(photoID => photos.find(p => p.id === photoID))
	},

	DateTime: new GraphQLScalarType({
		name: `DateTime`,
		description: `A valid date time value.`,
		parseValue: value => new Date(value),
		serialize: value => new Date(value).toISOString(),
		parseLiteral: ast => ast.value
	})
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