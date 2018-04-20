# Contributing to Alfresco Content Application (ACA)

Alfresco actively encourages external contributions to this Content Application so that the project can move develop in such a way that benefits the wider community.

As a contributor, here are the guidelines we would like you to follow:

* [Code of Conduct](#coc)
* [Question or Problem?](#question)
* [Issues and Bugs](#issue)
* [Feature Requests](#feature)
* [Submission Guidelines](#submit)
* [Coding Rules](#rules)
* [Signing the CLA](#cla)

## <a name="coc"></a> Code of Conduct

Help us keep Alfresco Content Application open and inclusive.
Please read and follow our [Code of Conduct][coc].

## <a name="question"></a> Got a Question or Problem?

Please do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests. 

The ADF [Gitter][gitter] channel is a much better place to ask questions:

* direct access to many experienced Angular and ADF developers
* questions and answers stay available for public viewing so your question / answer might help someone else
* all discussions are saved and indexed, you can search for previous answers

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by:

* [submitting an issue](#submit-issue) to our [ACA JIRA project][jira]
* [submitting an issue](#submit-issue) to our [GitHub Repository][github].

Even better, [submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

You can *request* a new feature by [submitting an issue](#submit-issue)
to our [JIRA project][jira] or GitHub Repository.
If you would like to *implement* a new feature, please submit an issue with a proposal for your work first,
to be sure that we can use it.

Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

Before you submit an issue, search the issue tracker, an issue for your problem may already exist
and the discussion might inform you of potential workarounds.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it.
In order to reproduce bugs, we require you to provide a description of the problem, steps to reproduce and other supporting information that will help us recreate the problem you experianced.

Having a reproducible scenario gives us a wealth of important information without going back & forth to you with additional questions like:

* version of node.js used
* version of NPM used
* version of Angular used
* versions of ADF libraries used
* 3rd-party libraries and their versions
* and most importantly - a use-case that fails

You can file new issues by filling out our [new issue form](https://github.com/Alfresco/alfresco-content-app/issues/new).

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/Alfresco/alfresco-content-app/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.
1. Sign the [Contributor License Agreement (CLA)](#cla) before sending PRs.
  We cannot accept code without this.
  Make sure you sign with the primary email address of the Git identity that has been granted access to the Angular repository.
1. Fork the ACA repository.
1. Make your changes in a new git branch based on **development**:

    ```shell
    git checkout -b my-fix-branch development
    ```

1. Create your patch, **including appropriate test cases**.
1. Follow our [Coding Rules](#rules).
1. Run the full ACA test suite and ensure that all tests pass.
1. Commit your changes using a descriptive commit message.
1. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

1. In GitHub, send a pull request to `alfresco-content-app:development`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the ACA test suites to ensure tests are still passing.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase development -i
    git push -f
    ```

That's it! Thank you for your contribution!

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).
* All public API methods **must be documented**.

## <a name="cla"></a> Signing the CLA

Sign the [Contributor License Agreement (CLA)][cla] before sending pull requests.
In addition, you will get the CLA link automatically generated for your first pull request.

For any code changes to be accepted, the CLA must be signed.

<hr>

If you have more than one Git identity, you must make sure that you sign the CLA using the primary
email address associated with the ID that has been granted access to the Angular repository.
Git identities can be associated with more than one email address, and only one is primary.

Here are some links to help you sort out multiple Git identities and email addresses:

  * https://help.github.com/articles/setting-your-commit-email-address-in-git/
  * https://stackoverflow.com/questions/37245303/what-does-usera-committed-with-userb-13-days-ago-on-github-mean
  * https://help.github.com/articles/about-commit-email-addresses/
  * https://help.github.com/articles/blocking-command-line-pushes-that-expose-your-personal-email-address/

  Note that if you have more than one Git identity, it is important to verify that you are logged in
  with the same ID with which you signed the CLA, before you commit changes. If not, your PR will fail the CLA check.

<hr>

[coc]: https://github.com/Alfresco/alfresco-content-app/blob/master/CODE_OF_CONDUCT.md
[github]: https://github.com/Alfresco/alfresco-content-app
[gitter]: https://gitter.im/Alfresco/alfresco-ng2-components
[jira]: https://issues.alfresco.com/jira/projects/ACA
[cla]: https://cla-assistant.io/Alfresco/alfresco-content-app
