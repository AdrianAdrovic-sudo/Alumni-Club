import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ThesisFilters {
    search?: string;
    type?: string;
    year?: number;
}

export const getAllTheses = async (
    filters: ThesisFilters = {},
    page: number = 1,
    limit: number = 10,
    sortBy: string = "created_at",
    sortOrder: "asc" | "desc" = "desc"
) => {
    const skip = (page - 1) * limit;

    // We are now querying USERS who have a thesis (thesis_title is not null)
    const where: Prisma.usersWhereInput = {
        thesis_title: { not: null },
    };

    if (filters.search) {
        where.OR = [
            { thesis_title: { contains: filters.search, mode: "insensitive" } },
            { first_name: { contains: filters.search, mode: "insensitive" } },
            { last_name: { contains: filters.search, mode: "insensitive" } },
        ];
    }

    if (filters.type && filters.type !== "all") {
        where.thesis_type = filters.type;
    }

    if (filters.year) {
        // If we want to filter by year, we need to extract year from defense_date or use a custom query.
        // Since defense_date is a DateTime on user, for simplicity in Prisma without raw queries:
        // We can filter by date range if 'year' is provided.
        const startDate = new Date(`${filters.year}-01-01`);
        const endDate = new Date(`${filters.year}-12-31`);
        where.defense_date = {
            gte: startDate,
            lte: endDate
        };
    }

    const orderBy: Prisma.usersOrderByWithRelationInput = {};
    if (sortBy === "student_name") {
        orderBy.first_name = sortOrder;
    } else if (sortBy === "student_last_name") {
        orderBy.last_name = sortOrder;
    } else if (sortBy === "title") {
        orderBy.thesis_title = sortOrder;
    } else if (sortBy === "defense_date") {
        orderBy.defense_date = sortOrder;
    } else {
        // Default fallback
        orderBy.updated_at = sortOrder;
    }


    const [users, total] = await Promise.all([
        prisma.users.findMany({
            where,
            skip,
            take: limit,
            orderBy: orderBy,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                thesis_title: true,
                thesis_type: true,
                defense_date: true,
                mentor_first_name: true,
                mentor_last_name: true,
                thesis_document_url: true,
            }
        }),
        prisma.users.count({ where }),
    ]);

    return {
        theses: users.map(user => ({
            // Map user fields to a "thesis" structure expected by frontend or keeps it as is
            id: user.id,
            title: user.thesis_title,
            student_first_name: user.first_name,
            student_last_name: user.last_name,
            mentor_first_name: user.mentor_first_name,
            mentor_last_name: user.mentor_last_name,
            defense_date: user.defense_date,
            type: user.thesis_type,
            document_url: user.thesis_document_url
        })),
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

// Create/Update would logicall be an update to the User profile now.
// We can keep these as specific "Thesis Update" methods that modify the user record.

export const createThesis = async (data: any) => {
    // Creating a thesis now actually means "Assigning a thesis to an existing user" or "Creating a user with a thesis"
    // Assuming for now we are assigning to an existing user via their ID, or this might be an ADMIN function to update a user.
    // Let's assume input 'data' has 'userId'
    if (!data.userId) throw new Error("User ID required to assign thesis");

    return await prisma.users.update({
        where: { id: data.userId },
        data: {
            thesis_title: data.title,
            thesis_type: data.type,
            defense_date: new Date(data.defense_date),
            mentor_first_name: data.mentor_first_name,
            mentor_last_name: data.mentor_last_name,
            thesis_document_url: data.document_url
        }
    });
};

export const getThesisById = async (id: number) => {
    // This is fetching a USER by ID but effectively treating them as a thesis record
    const user = await prisma.users.findUnique({
        where: { id },
    });

    if (!user || !user.thesis_title) return null;

    return {
        id: user.id,
        title: user.thesis_title,
        student_first_name: user.first_name,
        student_last_name: user.last_name,
        mentor_first_name: user.mentor_first_name,
        mentor_last_name: user.mentor_last_name,
        defense_date: user.defense_date,
        type: user.thesis_type,
        document_url: user.thesis_document_url
    };
};

export const updateThesis = async (id: number, data: any) => {
    return await prisma.users.update({
        where: { id },
        data: {
            thesis_title: data.title,
            thesis_type: data.type,
            defense_date: data.defense_date ? new Date(data.defense_date) : undefined,
            mentor_first_name: data.mentor_first_name,
            mentor_last_name: data.mentor_last_name,
            thesis_document_url: data.document_url
        },
    });
};

export const deleteThesis = async (id: number) => {
    // Clear thesis fields on the user
    return await prisma.users.update({
        where: { id },
        data: {
            thesis_title: null,
            thesis_type: null,
            defense_date: null,
            mentor_first_name: null,
            mentor_last_name: null,
            thesis_document_url: null
        },
    });
};
