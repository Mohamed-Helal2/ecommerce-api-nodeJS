import { Router } from "express";
import * as RC from "./review.controller.js";
import  * as RS from "./review.schema.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
export const reviewRouter=new Router({mergeParams:true});

// add review

reviewRouter.post('',
    authnticatedMiddleware,
    authorizedMiddleware(['user']),
    validationMiddleware(RS.addReviewScehma),
    RC.addReview
);

// update review

reviewRouter.patch('/:id',
    authnticatedMiddleware,
    authorizedMiddleware(['user']),
    validationMiddleware(RS.updateReviewScehma),
    RC.updateReview
);