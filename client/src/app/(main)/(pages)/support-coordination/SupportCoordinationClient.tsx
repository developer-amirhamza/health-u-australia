
"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "utils/PageBanner";
import Image from "next/image";
import { TiTick } from "react-icons/ti";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "app/variants";

import { SummeryApi } from "app/common/SummeryApi";
import Axios from "utils/Axios";
import AxiosToastError from "utils/AxiosToastError";

// Support Coordination uses keyword-based bullet points
interface SupportBullet {
    keyword: string;
    text: string;
}

interface SupportCoordinationBody {
    title1?: string;
    title2?: string;
    title3?: string;
    title4?: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    bullet_title?: string;
    bullet_points?: SupportBullet[];
}

interface SupportCoordinationItem {
    id: string;
    pageKey: string;
    section: string | null;
    title: string;
    slug: string | null;
    body: SupportCoordinationBody;
    images: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

type RawSupportCoordinationItem =
    Omit<SupportCoordinationItem, "body" | "images"> & {
        body: unknown;
        images: unknown;
    };

// Convert database body into a safe object
function parseBody(body: unknown): SupportCoordinationBody {
    let parsed: unknown = body;

    if (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            return {};
        }
    }

    if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
    ) {
        return {};
    }

    const value = parsed as Record<string, unknown>;

    const bullet_points: SupportBullet[] = Array.isArray(
        value.bullet_points
    )
        ? value.bullet_points
              .map((bullet: unknown): SupportBullet => {
                  if (typeof bullet === "string") {
                      return {
                          keyword: "",
                          text: bullet,
                      };
                  }

                  if (
                      bullet &&
                      typeof bullet === "object" &&
                      !Array.isArray(bullet)
                  ) {
                      const item = bullet as Record<string, unknown>;

                      return {
                          keyword:
                              typeof item.keyword === "string"
                                  ? item.keyword
                                  : "",
                          text:
                              typeof item.text === "string"
                                  ? item.text
                                  : "",
                      };
                  }

                  return {
                      keyword: "",
                      text: "",
                  };
              })
              .filter((bullet) => bullet.keyword || bullet.text)
        : [];

    return {
        title1:
            typeof value.title1 === "string"
                ? value.title1
                : "",
        title2:
            typeof value.title2 === "string"
                ? value.title2
                : "",
        title3:
            typeof value.title3 === "string"
                ? value.title3
                : "",
        title4:
            typeof value.title4 === "string"
                ? value.title4
                : "",
        paragraph1:
            typeof value.paragraph1 === "string"
                ? value.paragraph1
                : "",
        paragraph2:
            typeof value.paragraph2 === "string"
                ? value.paragraph2
                : "",
        paragraph3:
            typeof value.paragraph3 === "string"
                ? value.paragraph3
                : "",
        bullet_title:
            typeof value.bullet_title === "string"
                ? value.bullet_title
                : "",
        bullet_points,
    };
}

// Supports Cloudinary URLs stored as strings or objects
function parseImages(images: unknown): string[] {
    if (!Array.isArray(images)) {
        return [];
    }

    return images
        .map((image: unknown) => {
            if (typeof image === "string") {
                return image;
            }

            if (
                image &&
                typeof image === "object" &&
                !Array.isArray(image)
            ) {
                const item = image as Record<string, unknown>;

                if (typeof item.secure_url === "string") {
                    return item.secure_url;
                }

                if (typeof item.url === "string") {
                    return item.url;
                }
            }

            return "";
        })
        .filter((url): url is string => Boolean(url));
}

const SupportCoordination = () => {
    const [
        support_coordination,
        setSupportCoordination,
    ] = useState<SupportCoordinationItem[]>([]);

    const fetchSupportCoordination = async () => {
        try {
            const response = await Axios({
                ...SummeryApi.getContent,
                params: {
                    pageKey: "support_coordination",
                },
            });

            const result = response.data;

            const success =
                result?.success === true ||
                result?.error === false;

            if (!success) {
                return;
            }

            const data: RawSupportCoordinationItem[] =
                Array.isArray(result?.data)
                    ? result.data
                    : [];

            const publishedContent = data
                .filter(
                    (item) =>
                        item.pageKey === "support_coordination" &&
                        item.isPublished
                )
                .map((item) => ({
                    ...item,
                    body: parseBody(item.body),
                    images: parseImages(item.images),
                }))
                .sort((a, b) => a.order - b.order);

            setSupportCoordination(publishedContent);
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        void fetchSupportCoordination();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner
                title="Support Coordination"
                path="/support-coordination"
            />

            <div className="container px-5 flex gap-8 flex-col items-center mx-auto justify-center w-full h-full ">
                {support_coordination.map((item, index) => (
                    <div
                        key={item.id}
                        className={`flex flex-col gap-x-10 ${
                            [0, 2, 4].includes(index)
                                ? "md:flex-row-reverse"
                                : "md:flex-row"
                        } justify-center items-start w-full`}
                    >
                        <motion.div
                            variants={fadeIn(
                                [0, 2, 4].includes(index)
                                    ? "right"
                                    : "left",
                                0.2
                            )}
                            initial="hidden"
                            whileInView={"show"}
                            className="flex w-full h-full"
                        >
                            {item.images[0] && (
                                <Image
                                    src={item.images[0]}
                                    alt="about heath u australia"
                                    width={500}
                                    height={520}
                                    className="hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center inset-0 items-start justify-start p-0 m-0 "
                                />
                            )}
                        </motion.div>

                        <motion.div
                            variants={fadeIn(
                                [0, 2, 4].includes(index)
                                    ? "left"
                                    : "right",
                                0.2
                            )}
                            initial="hidden"
                            whileInView={"show"}
                            className="flex flex-col w-full justify-center gap-2    "
                        >
                            <h2 className="text-[27px] font-bold  ">
                                {item.body.title1}{" "}
                                <span className="text-secondary">
                                    {item.body.title2}
                                </span>
                            </h2>

                            <div className="w-14 h-0.75 bg-primary items-center  " />

                            <p className=" flex w-full text-lg text-secondary-text font-medium  ">
                                {item.body.paragraph1}
                            </p>

                            <ul className="grid gap-2">
                                {/* Original bullet-title display remains disabled */}

                                {item.body.bullet_points?.map(
                                    (itm, idx) => (
                                        <li
                                            key={idx}
                                            className=" flex items-start w-full gap-2 "
                                        >
                                            <TiTick className="bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white " />

                                            <p className="text-lg font-medium text-secondary-text ">
                                                <strong>
                                                    {itm.keyword}{" "}
                                                </strong>
                                                {itm.text}
                                            </p>
                                        </li>
                                    )
                                )}

                                <h2 className="text-[27px] font-bold  ">
                                    {item.body.title3}{" "}
                                    <span className="text-secondary">
                                        {item.body.title4}
                                    </span>
                                </h2>

                                <p className="text-lg text-secondary-text font-medium my-2">
                                    {item.body.paragraph2}{" "}
                                </p>

                                {/* Original paragraph3 display remains disabled */}
                            </ul>
                        </motion.div>
                    </div>
                ))}

                <motion.div
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    "
                >
                    <h2 className="text-3xl font-bold  ">
                        Reach Out to Us Today!
                    </h2>

                    <div className="w-14 h-0.75 bg-primary items-center  " />

                    <p className=" text-lg text-secondary-text font-medium text-center ">
                        If you want to learn more about support coordination
                        and how our team can help you achieve your goals,{" "}
                        <a
                            className="text-blue-600"
                            href="tel:0481 707 758"
                        >
                            Call now
                        </a>{" "}
                        to book an appointment. For more queries, send an
                        email, and we will reply to you soon.
                    </p>

                    <div className="flex items-center justify-center gap-10">
                        <Link
                            href={"/contact-us"}
                            className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 "
                        >
                            Enquire Now
                        </Link>

                        <Link
                            href={"/referral"}
                            className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 "
                        >
                            Referral
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SupportCoordination;
