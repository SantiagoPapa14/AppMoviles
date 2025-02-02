const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateTimetable(id, newTimetable) {
    await prisma.user.update({
        where: { userId: parseInt(id,10) },  
        data: { timetable: JSON.stringify(newTimetable) },
    });
}

async function getTimetable(id) {

    console.log(id)
    const user = await prisma.user.findUnique({
        where: { userId: parseInt(id,10) },  
        select: { timetable: true },
    });
    return JSON.parse(user.timetable);  
}

module.exports = { updateTimetable, getTimetable };
