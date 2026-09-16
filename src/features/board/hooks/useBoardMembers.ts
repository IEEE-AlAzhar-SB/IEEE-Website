import { useMemo, useState } from "react";
import { useBoardQuery } from "../../../hooks/queries/useBoardQuery";
import { useBoardYearsQuery, useBoardMetaQuery } from "../../../hooks";
import {
  useCreateBoardMember,
  useUpdateBoardMember,
  useDeleteBoardMember,
} from "../../../hooks/mutations/useBoardMutations";

export type BoardMemberType =
  "officer" | "branding" | "technical" | "operation";
export type MemberFilter = "All" | BoardMemberType;

export interface BoardMember {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  bio?: string;
  position?: string;
  memberType?: BoardMemberType;
  track?: string;
  gender?: "male" | "female";
  linkedin_url?: string;
  boardYear?: number;
  image_url?: string;
  image_public_id?: string;
}

export interface CurrentMemberFormState {
  id?: string;
  name: string;
  email?: string;
  bio: string;
  position: string;
  memberType: BoardMemberType;
  track: string;
  gender: "male" | "female";
  linkedin_url: string;
  boardYear: number;
}

export const useBoardMembers = () => {
  const [typeFilter, setTypeFilter] = useState<MemberFilter>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");

  const { data: boardYears } = useBoardYearsQuery();
  const { data: boardMeta, isLoading: isMetaLoading } = useBoardMetaQuery();

  const yearFrom =
    yearFilter === "All"
      ? (boardYears?.[0] ?? new Date().getFullYear().toString())
      : yearFilter;
  const yearTo = yearFilter === "All" ? boardYears?.at(-1) : undefined;

  const yearFromStr = String(yearFrom);
  const yearToStr = yearTo == null ? undefined : String(yearTo);

  const {
    data: boardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBoardQuery({
    year: yearFromStr,
    yearTo: yearToStr,
    memberType:
      typeFilter === "All"
        ? ["officer", "technical", "branding", "operation"]
        : [typeFilter],
    enabled: !!yearFromStr,
  });

  const members = useMemo(() => {
    if (!boardData) return [] as BoardMember[];
    if (Array.isArray(boardData)) return boardData as BoardMember[];

    const result: BoardMember[] = [];
    Object.values(boardData).forEach((categoryData) => {
      if (Array.isArray(categoryData)) {
        result.push(...categoryData);
      } else if (typeof categoryData === "object" && categoryData !== null) {
        Object.values(categoryData).forEach((trackData) => {
          if (Array.isArray(trackData)) {
            result.push(...trackData);
          }
        });
      }
    });
    return result;
  }, [boardData]);

  const totalCount = members.length;
  const officerCount = useMemo(
    () => members.filter((member) => member.memberType === "officer").length,
    [members],
  );
  const currentYear = Number(
    boardYears?.[boardYears.length - 1] ?? new Date().getFullYear(),
  );
  const currentYearCount = useMemo(
    () => members.filter((member) => member.boardYear === currentYear).length,
    [members, currentYear],
  );

  const { mutate: createMember, isPending: isCreating } =
    useCreateBoardMember();
  const { mutate: updateMember, isPending: isUpdating } =
    useUpdateBoardMember();
  const { mutate: deleteMember, isPending: isDeleting } =
    useDeleteBoardMember();

  return {
    boardYears: boardYears ?? [],
    typeFilter,
    setTypeFilter,
    yearFilter,
    setYearFilter,
    members,
    totalCount,
    officerCount,
    currentYear,
    currentYearCount,
    isLoading,
    isError,
    error,
    refetch,
    createMember,
    updateMember,
    deleteMember,
    isCreating,
    isUpdating,
    isDeleting,
    boardMeta,
    isMetaLoading,
  };
};
