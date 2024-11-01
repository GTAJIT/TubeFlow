import {atom} from 'recoil'

const videoContext = atom({
    key: "videoDetails",
    default: [{
        id: 0,
        videoFile: "",
        thumbnail: "",
        title: "",
        description: "",
        duration: 0, // Duration in seconds
        views: 0,
        isPublished: false,
        createdAt: "", // You might want to format this date
        updatedAt: "", // You might want to format this date
        userId: ""
    }]
})

export default videoContext