class UsersService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create(data) {
    return this.prisma.user.create({ data });
  }

  findById(id) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }
}

export { UsersService };
