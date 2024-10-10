# YouTube Backend API

This project is a backend system for a YouTube-like platform, originally built by **Hitest Choudhury**. I am rebuilding it using **TypeScript** and **Prisma** (for PostgreSQL running on Docker) to improve my understanding of backend development and explore opportunities for enhancements.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT-based token management.
- **Video Management**: Upload, stream, like, comment, and share videos.
- **Playlists**: Create and manage user-specific playlists.
- **Real-time Notifications**: Powered by Socket.io for instant updates.
- **Video Recommendations**: Personalized suggestions based on user activity.

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for static typing and better code management.
- **Prisma ORM** for database interaction with **PostgreSQL**.
- **Docker** to containerize the PostgreSQL database.
- **JWT** for secure authentication.
- **bcrypt** for password hashing.

## 📦 Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/MohakGupta2004/youtube-backend.git
    cd youtube-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up Docker for PostgreSQL**:
    Ensure Docker is installed and run the following command to set up PostgreSQL:
    ```bash
    docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
    ```

4. **Environment variables**:
    Create a `.env` file and configure the necessary environment variables such as:
    ```plaintext
    DATABASE_URL="postgresql://you:yousecretpassword@localhost:5432/youtube"
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

5. **Run the application**:
    ```bash
    npm run dev
    ```

## 🔧 Prisma and Database

1. **Prisma Migrations**: After setting up PostgreSQL with Docker, apply the migrations:
    ```bash
    npx prisma migrate dev
    ```

2. **Prisma Studio**: Use Prisma Studio to explore your database:
    ```bash
    npx prisma studio
    ```

## 🧑‍💻 Development

- **TypeScript** ensures type safety and maintainable code.
- **Prisma** simplifies database management with type-safe queries.

## 🚧 Deployment

I haven't planned deployment yet, but the project is containerized for portability.

## 🔗 GitHub Repository

Find the project repository [here](https://github.com/MohakGupta2004/youtube-backend.git).

--- 

Feel free to explore, suggest improvements, or contribute to the project as I continue to refine and expand it for learning purposes!
