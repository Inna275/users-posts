class UsersService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create(data) {
    return this.prisma.user.create({ data });
  }

  findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }
}

export { UsersService };
