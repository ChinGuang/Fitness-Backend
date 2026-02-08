import { Like, QueryFailedError } from "typeorm";
import { AppDataSource } from "../../db/data-source";
import { Member } from "../../entity/Member";
import { CreateMemberDto, ReadMembersDto } from "../../models/member.interface";

export class MemberModule {
  static async read(payload: ReadMembersDto): Promise<Member[]> {
    const { keyword, limit, page } = payload;
    const offset = (page - 1) * limit;
    const result = await AppDataSource.getRepository(Member).find({
      where: keyword ? [{
        profile: {
          firstName: Like(`%${keyword}%`),
        },
      }, {
        profile: {
          lastName: Like(`%${keyword}%`),
        },
      }] : {},
      relations: {
        profile: true
      },
      take: limit,
      skip: offset,
    });
    return result;
  }

  static async readOne(id: number): Promise<Member | null> {
    const result = await AppDataSource.getRepository(Member).findOne({
      where: {
        id,
      },
      relations: {
        profile: true
      },
    });
    return result;
  }

  static async create(payload: CreateMemberDto): Promise<Member | null> {
    try {
      const result = await AppDataSource.getRepository(Member).save(payload);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return null;
      }
      console.error(error);
      throw new Error('Failed to create member');
    }
  }
}
