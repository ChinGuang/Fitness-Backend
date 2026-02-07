import { Like } from "typeorm";
import { AppDataSource } from "../../db/data-source";
import { Member } from "../../entity/Member";
import { ReadMembersDto } from "../../models/member.interface";

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
}
