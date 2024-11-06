# TubeFlow - Full Stack YouTube-like Platform

This project, **TubeFlow**, is a full-stack implementation of a YouTube-like platform, initially built by **Hitest Choudhury**. I am rebuilding and expanding it using **TypeScript** and **Prisma** (with a PostgreSQL database on Docker) to strengthen my skills in full-stack development, with enhancements on both the backend and frontend.

## Contributing

We welcome contributions to TubeFlow! Please read our [Contributing Guidelines](https://github.com/MohakGupta2004/TubeFlow/blob/main/CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for more details on how to get started.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT-based token management.
- **Video Management**: Users can upload, stream, like, comment, and share videos.
- **Playlists**: Enable users to create and manage personalized playlists.
- **Real-time Notifications**: Get instant updates on likes, comments, and subscriptions, powered by Socket.io.
- **Video Recommendations**: Provides personalized suggestions based on user interaction and preferences.

## 🛠️ Tech Stack

- **Frontend**: React.js with TypeScript for a scalable, efficient user interface.
- **Backend**: Node.js with Express.js for server-side logic.
- **TypeScript**: Ensures type safety and better code management across the stack.
- **Prisma ORM**: For type-safe interactions with a PostgreSQL database.
- **Docker**: Containerizes the PostgreSQL database and provides easy portability.
- **JWT & bcrypt**: For secure authentication and password management.

## 📦 Installation

### 1. Clone the repository:
```bash
git clone https://github.com/MohakGupta2004/tubeflow.git
cd tubeflow
```

### 2. Install dependencies:
```bash
cd Frontend
npm install
cd..
cd Backend
npm install
```

### 3. Set up Docker for PostgreSQL:
Ensure Docker is installed, and set up PostgreSQL by running (make sure if you are running this locally then run backend locally otherwise it doens't work):
```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

### 4. Configure environment variables:
Create a `.env` file and set up the following environment variables:
```plaintext
DATABASE_URL="postgresql://user:password@localhost:5432/tubeflow" (Best practice: Change this to any cloud database e.g. NeonDB)
PORT=5000
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET=
JWT_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_EXPIRY=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
```

### 5. Run the application in both frontend and backend:
```bash
npm run dev
```

## 🔧 Database Setup with Prisma

1. **Apply Prisma Migrations**:
   After PostgreSQL is up and running, apply the migrations:
   ```bash
   npx prisma migrate dev
   ```

2. **Explore the Database** with Prisma Studio:
   ```bash
   npx prisma studio
   ```

## 🧑‍💻 Development Process

- **Frontend**: The frontend is developed using **React** and **TypeScript**, focusing on component-based design and reactivity.
- **Backend**: Built with **Node.js** and **Express.js**, managing API routes and business logic.
- **Prisma** ensures database queries are type-safe and maintainable.



## 🚧 Deployment

While deployment is not yet planned, the entire project is containerized with **Docker**, making it easy to deploy on any server with Docker support.

## 🔗 GitHub Repository

Find the project repository [here](https://github.com/MohakGupta2004/tubeflow.git). Repository managed by MohakGupta2004 and MohakTech
