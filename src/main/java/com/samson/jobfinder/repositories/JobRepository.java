package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.Job;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query(
            value = """
            SELECT
                j.id AS jobId,
                j.title AS title,
                j.description AS description,

                COUNT(jv.*) FILTER (WHERE jv.vote_type = 'LIKE') AS likes,
                COUNT(jv.*) FILTER (WHERE jv.vote_type = 'DISLIKE') AS dislikes,

                COALESCE(
                    MAX(jv.vote_type) FILTER (WHERE jv.visitor_id = :visitorId),
                    'NONE'
                ) AS visitorVoteType

            FROM jobs j
            LEFT JOIN job_votes jv ON jv.job_id = j.id
            GROUP BY j.id
            """,
            countQuery = """
            SELECT COUNT(*) FROM jobs
            """,
            nativeQuery = true
    )
    Page<JobWithVoteSummaryProjection> findAllJobsWithVotes(
            @Param("visitorId") Long visitorId,
            Pageable pageable
    );


//    @Query("""
//                SELECT j
//                FROM Job j
//                WHERE (:keyword IS NULL OR
//                    LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
//                    LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
//                    LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND
//                    (:categoryId IS NULL OR j.category.id = :categoryId)
//            """
//    )
//    Page<Job> searchJobs(@Param("keyword") String keyword,
//                         @Param("categoryId") Integer categoryId,
//                         Pageable pageable);
//
    Page<Job> findByCategoryId(Integer categoryId, Pageable pageable);

    boolean existsByTitleAndCompany(@NonNull String title, String company);

    @Query(
            value = """
            SELECT
                j.id AS jobId,
                j.title AS title,
                j.company AS company,
                j.description AS description,
                j.category_id AS categoryId,
                j.created_on AS createdOn,

                COUNT(CASE WHEN jv.vote_type = 'LIKE' THEN 1 END) AS likes,
                COUNT(CASE WHEN jv.vote_type = 'DISLIKE' THEN 1 END) AS dislikes,

                COALESCE(
                    MAX(CASE WHEN jv.visitor_id = :visitorId THEN jv.vote_type END),
                    'NONE'
                ) AS visitorVoteType

            FROM jobs j
            LEFT JOIN job_votes jv ON jv.job_id = j.id

            WHERE (
                :keyword IS NULL
                OR j.title LIKE CONCAT('%', :keyword, '%')
                OR j.company LIKE CONCAT('%', :keyword, '%')
                OR j.description LIKE CONCAT('%', :keyword, '%')
            )
            AND (
                :categoryId IS NULL
                OR j.category_id = :categoryId
            )

            GROUP BY j.id
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM jobs j
            WHERE (
                :keyword IS NULL
                OR j.title LIKE CONCAT('%', :keyword, '%')
                OR j.company LIKE CONCAT('%', :keyword, '%')
                OR j.description LIKE CONCAT('%', :keyword, '%')
            )
            AND (
                :categoryId IS NULL
                OR j.category_id = :categoryId
            )
            """,
            nativeQuery = true
    )
    Page<JobWithVoteSummaryProjection> searchJobsWithFilters(String keyword, Integer categoryId, String visitorId, Pageable pageable);

    @Query(
            value = """
    SELECT
        j.id AS jobId,
        j.category_id AS categoryId,
        j.company,
        j.created_on AS createdOn,
        j.title AS title,
        j.description AS description,

        COUNT(CASE WHEN jv.vote_type = 'LIKE' THEN 1 END) AS likes,
        COUNT(CASE WHEN jv.vote_type = 'DISLIKE' THEN 1 END) AS dislikes,

        COALESCE(
            MAX(CASE WHEN jv.visitor_id = :visitorId THEN jv.vote_type END),
            'NONE'
        ) AS visitorVoteType

    FROM jobs j
    LEFT JOIN job_votes jv ON jv.job_id = j.id
    WHERE j.id = :jobId
    GROUP BY j.id, j.title, j.description
    """,
            nativeQuery = true
    )
    JobWithVoteSummaryProjection getJobWithVoteSummary(
            @Param("jobId") Long jobId,
            @Param("visitorId") String visitorId
    );

    @Query("""
        SELECT j FROM Job j 
        WHERE j.postedBy.id = :userId
        AND (:keyword IS NULL OR 
            LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR j.category.id = :categoryId)
    """)
    Page<Job> findJobsByPostedBy(
        @Param("userId") Long userId,
        @Param("keyword") String keyword,
        @Param("categoryId") Integer categoryId,
        Pageable pageable
    );
}
