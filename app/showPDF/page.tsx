"use client";

import dynamic from "next/dynamic";
import PDF from "../components/pdf/pdf1";
import { useDashboardData } from "@/hooks/useDashboardData";
import Link from "next/link";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  }
);

export default function ShowPDF() {

  const { memo, todos, isLoaded } = useDashboardData();

  if(!isLoaded) return null;

  // 空文字や空の <p></p>、改行のみのHTMLなどを空とみなすチェック
  const plainMemoText = memo
    .replace(/<[^>]*>/g, '') // HTMLタグを除去
    .replace(/&nbsp;/g, ' ')
    .trim();

  const isMemoEmpty = plainMemoText.length === 0;
  const isTodoEmpty = todos.length === 0;

  if (isMemoEmpty && isTodoEmpty) {
    return (
      <div className="p-10 text-center text-gray-600">
        <p className="mb-10">
          記録がありません。もしくは最後に入力してから24時間経過しており、記録が削除されました。
        </p>
        <Link href="/" className="text-[#5c988e] border-b border-[#5c988e] hover:text-slate-300 hover:border-slate-300">ダッシュボードへ戻る</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <PDFViewer width="100%" height="100%">
        <PDF />
      </PDFViewer>
    </div>
  );
}
