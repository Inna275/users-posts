class PostsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create(data) {
    return this.prisma.post.create({ data });
  }

  findById(id) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.post.findMany();
  }
}

export { PostsService };
